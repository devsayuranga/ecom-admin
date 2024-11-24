import React from 'react';
import { useContext } from 'react';
import { BookingContext } from '../provider';

const BookingNotes = () => {
  const { serviceData, service_id } = useContext(BookingContext);
  const currentService = serviceData?.find((item) => item.id == service_id);

  console.log(currentService);

  return <div>BookingNotes</div>;
};

export default BookingNotes;
