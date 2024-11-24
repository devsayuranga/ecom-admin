import { Card, Divider } from 'antd';
import numberToPrice from 'helpers/numberToPrice';
import { t } from 'i18next';
import moment from 'moment';
import { useContext } from 'react';
import bookingService from 'services/booking';
import { BookingContext } from '../provider';

const ServiceCard = ({ item, isUpdate }) => {
  const { setViewContent, serviceForm, service_id } =
    useContext(BookingContext);

  const handleClick = () => {
    setViewContent('updateService');
    bookingService
      .getById(service_id)
      .then(({ data }) => {
        serviceForm.setFieldsValue({
          id: service_id,
          currency_id: {
            label: data?.currency?.title,
            value: data?.currency?.id,
            key: data?.currency?.id,
          },
          shop: {
            key: data?.shop?.id,
            value: data?.shop?.id,
            label: data?.shop?.translation?.title,
          },
          service: {
            key: data?.service_master?.service?.id,
            value: data?.service_master?.service?.id,
            label: data?.service_master?.service?.translation?.title,
          },
          master: {
            key: data?.master?.id,
            value: data?.master?.id,
            label: `${data?.master?.firstname} ${data?.master?.lastname}`,
          },
          end_date: moment(data?.end_date).utc(),
          start_date: moment(data?.start_date).utc(),
          note: data?.note,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card
      className={`service-card ${
        Boolean(item.errors?.length > 0) && !isUpdate && 'error'
      }`}
      onClick={() => handleClick(item)}
    >
      <ul className='mb-0'>
        <li className='mb-3'>
          <strong className='font-size-5'>
            {item.service_master?.service?.translation?.title}
          </strong>
        </li>
        <li>{`${moment(item.start_date).format('LT')} - ${moment(
          item.end_date
        ).format('LT')} (${item?.service_master?.interval}min + ${
          item?.service_master?.pause
        }min processing time)`}</li>
        {/* <li>{`${item.master?.firstname} ${item.master?.lastname}`}</li> */}
        <li className='mt-2 d-flex gap-2'>
          <span>{t('commission.fee')}:</span>
          {numberToPrice(item?.commission_fee)}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('discount')}:</span>
          {numberToPrice(item?.discount)}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('gift.cart.price')}:</span>
          {numberToPrice(item?.gift_cart_price)}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('service.fee')}:</span>
          {numberToPrice(item?.service_fee)}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('service.master.price')}:</span>
          {numberToPrice(item?.service_master.price)}
        </li>
        <Divider />
        <li className='mt-2 d-flex gap-2'>
          <strong>{t('total.price')}:</strong>
          {numberToPrice(item?.total_price)}
        </li>
        {!isUpdate && (
          <div className='error-list'>
            {item.errors?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </div>
        )}
      </ul>
    </Card>
  );
};

export default ServiceCard;
