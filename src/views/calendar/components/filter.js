import { Card, Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import mastersService from 'services/rest/masters';
import { fetchBookingList } from 'redux/slices/booking';
import { fetchMasterDisabledTimesAsAdmin } from 'redux/slices/disabledTimes';
import { useDispatch } from 'react-redux';

const BookingFilter = () => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);

  function fetchMasterList() {
    const params = {
      perPage: 100,
      role: 'master',
    };
    mastersService.getAll(params).then(({ data }) => {
      const masters = data.map((item) => ({
        label: `${item?.firstname} ${item?.lastname}`,
        value: item?.id,
        key: item?.id,
      }));
      setOptions(masters);
    });
  }

  const handleFilter = (master) => {
    dispatch(fetchBookingList({ master_id: master?.value }));
    dispatch(
      fetchMasterDisabledTimesAsAdmin({
        perPage: 100,
        master_id: master?.value,
      })
    );
  };

  useEffect(() => {
    fetchMasterList();
  }, []);

  return (
    <Card>
      <Row gutter={24}>
        <Col span={4}>
          <Select
            className='w-100'
            defaultValue={{
              label: `All`,
              value: null,
              key: null,
            }}
            onChange={(_, option) => handleFilter(option)}
          >
            {options.map((item) => (
              <Select.Option key={item.key} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Card>
  );
};

export default BookingFilter;
