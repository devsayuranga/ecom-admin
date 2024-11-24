import { Card, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useSelector } from 'react-redux';
import bookingService from 'services/booking';
import { BookingContext } from '../provider';
import { useNavigate } from 'react-router-dom';
import { fetchMasterDisabledTimesAsAdmin } from 'redux/slices/disabledTimes';
import { useDispatch } from 'react-redux';

const CalendarView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localizer = momentLocalizer(moment); // or globalizeLocalizer
  const { bookingList, loading } = useSelector((state) => state.booking);
  const { disabledTimes } = useSelector((state) => state.disabledTimes);

  const {
    infoForm,
    setIsLoading,
    setViewContent,
    setIsModalOpen,
    setSelectedSlots,
    setCalculatedData,
    setServiceData,
  } = useContext(BookingContext);

  const showModal = ({ start, end }) => {
    setIsModalOpen(true);
    setSelectedSlots({ start, end });
  };

  const calculate = (data, items) => {
    bookingService
      .calculate({
        user_id: data.user_id,
        payment_id: data.payment_id,
        currency_id: data.currency_id,
        data: items.map((item) => ({
          data: item.data,
          note: item.note,
          service_master_id: item.service_master.id,
        })),
        start_date: moment(data?.start).format('YYYY-MM-DD HH:mm'),
      })
      .then(({ data }) => {
        setCalculatedData(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSelectEvent = useCallback((event) => {
    if (event.disabled) {
      setViewContent('updateBlockTime');
      navigate(`?disabled_slot_id=${event.id}`);
      return;
    }
    setViewContent('updateForm');
    setIsLoading(true);
    navigate(`?service_id=${event.id}`);
    bookingService
      .getBookingById(event.parent_id)
      .then(({ data }) => {
        setServiceData(data);
        setSelectedSlots({
          start: data[data?.length - 1].start_date,
          end: data[data?.length - 1].end_date,
        });
        calculate(
          {
            user_id: data[0]?.user_id,
            start: data[0]?.start_date,
            currency_id: data[0]?.currency_id,
            payment_id: data[0]?.transaction?.payment_system?.id,
          },
          data
        );
        infoForm.setFieldsValue({
          id: event.parent_id,
          shop: {
            label: data[0]?.shop?.translation?.title,
            value: data[0]?.shop?.id,
            key: data[0]?.shop?.id,
          },
          client: {
            label: `${data[0]?.user?.firstname} ${data[0]?.user?.lastname}`,
            value: data[0]?.user?.id,
            key: data[0]?.user?.id,
          },
          currency_id: {
            label: data[0]?.currency?.title,
            value: data[0]?.currency?.id,
            key: data[0]?.currency?.id,
          },
          payment_id: {
            label: data[0]?.transaction?.payment_system?.tag,
            value: data[0]?.transaction?.payment_system?.id,
            key: data[0]?.transaction?.payment_system?.id,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(),
    }),
    []
  );

  const eventStyleGetter = (event, start, end, isSelected) => {
    if (event.disabled)
      return {
        className: 'disabled-slot',
      };
    else return '';
  };

  useEffect(() => {
    dispatch(fetchMasterDisabledTimesAsAdmin({ perPage: 100 }));
  }, [dispatch]);

  return (
    <Card className='h-100'>
      <Spin spinning={loading}>
        <Calendar
          localizer={localizer}
          startAccessor='start'
          endAccessor='end'
          defaultDate={defaultDate}
          events={[...bookingList, ...disabledTimes]}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={showModal}
          selectable
          scrollToTime={scrollToTime}
          timeslots={3}
          step={30}
          defaultView='day'
          eventPropGetter={eventStyleGetter}
        />
      </Spin>
    </Card>
  );
};

export default CalendarView;
