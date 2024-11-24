import React from 'react';
import { useContext } from 'react';
import { BookingContext } from '../provider';
import { Empty, Typography } from 'antd';
import { t } from 'i18next';
const { Title } = Typography;
const BookingActivity = () => {
  const { serviceData, service_id } = useContext(BookingContext);
  const currentService = serviceData?.find((item) => item.id == service_id);
  const isEmpty = Boolean(!currentService?.activities?.length);
  return (
    <div className='h-100'>
      <Title>{t('activities')}</Title>
      {currentService?.activities?.map((item) => (
        <li className='mb-2' key={item.id}>
          {item.note}
        </li>
      ))}

      {isEmpty && <Empty description={t('activities.not.found')} />}
    </div>
  );
};

export default BookingActivity;
