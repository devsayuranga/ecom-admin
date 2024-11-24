const { useContext } = require('react');
const { BookingContext } = require('../provider');
const { default: numberToPrice } = require('helpers/numberToPrice');

const Footer = () => {
  const { calculatedData, form, setCalculatedData, isUpdate, sumInterval } =
    useContext(BookingContext);
  return (
    <div>
      <div className='w-100 d-flex between my-2'>
        <strong className='font-size-5'>Total</strong>
        <strong className='font-size-5'>
          {`${numberToPrice(calculatedData?.total_price)} (${sumInterval}min)`}
        </strong>
      </div>
      {/* <div className='w-100 d-flex gap-2'>
        <Button
          type='primary'
          className='w-100'
          onClick={form.submit}
          disabled={!calculatedData?.status && !isUpdate}
        >
          {t('update')}
        </Button>
        <Button
          type='danger'
          className='w-100'
          onClick={() => {
            setOpen(false);
            form.resetFields();
            setCalculatedData({});
          }}
        >
          {t('close')}
        </Button>
      </div> */}
    </div>
  );
};

export default Footer;
