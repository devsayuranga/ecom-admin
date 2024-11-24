import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form,
  Col,
  Input,
  Row,
  InputNumber,
  Button,
  Space,
  Select,
} from 'antd';
import { batch, shallowEqual, useSelector, useDispatch } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';
import { DebounceSelect } from 'components/search';
import category from 'services/category';
// import MediaUpload from 'components/upload';
import { toast } from 'react-toastify';
import { removeFromMenu } from 'redux/slices/menu';
import { fetchServices } from 'redux/slices/services';
import { useLocation, useNavigate } from 'react-router-dom';
import { genders, statuses } from './statuses';
import { serviceTypes } from './serviceTypes';
import shopService from 'services/shop';

const ServiceForm = ({ form, handleSubmit, data = null }) => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  // const [images, setImages] = useState(!!data ? data?.image : []);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(data?.status);
  const [selectedCategory, setSelectedCategory] = useState(
    data?.category || {},
  );

  function getTranslationFields(values, field = 'title') {
    const list = languages.map((item) => {
      const translationValue = values[`${field}[${item.locale}]`];

      if (translationValue !== undefined) {
        return { [item.locale]: translationValue };
      }

      return null;
    });

    return Object.assign({}, ...list.filter(Boolean));
  }

  const fetchCategory = (search = '') => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      type: 'service',
    };

    if (!search?.trim()) delete params?.search;

    return category?.getAll(params).then((res) =>
      res?.data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const fetchShops = (search = '') => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      category_id: selectedCategory?.value,
    };

    if (!search?.trim()) delete params?.search;

    return shopService.getAll(params).then((res) =>
      res?.data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const onFinish = (values) => {
    setLoadingBtn(true);

    const body = {
      title: getTranslationFields(values, 'title'),
      description: getTranslationFields(values, 'description'),
      category_id: values?.category?.value,
      price: values?.price,
      interval: values?.interval,
      pause: values?.pause,
      commission_fee: values?.commission_fee,
      // images: images?.map((item) => item?.name),
      status: values?.status,
      status_note: values?.status_note,
      type: values?.type,
      gender: values?.gender,
      shop_id: values?.shop?.value,
    };

    if (values?.status !== statuses[2]) delete body?.status_note;

    handleSubmit(body)
      .then(() => {
        const nextUrl = 'services';

        toast.success(t('successfully.created'));
        form.resetFields();

        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchServices(state?.params));
        });

        navigate(`/${nextUrl}`);
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Form
      form={form}
      layout={'vertical'}
      onFinish={onFinish}
      initialValues={{ ...data }}
    >
      <Row gutter={12}>
        <Col span={12}>
          {languages.map((item, idx) => (
            <Form.Item
              key={'title' + idx}
              label={t('title')}
              name={`title[${item.locale}]`}
              rules={[
                {
                  required: item.locale === defaultLang,
                  message: t('required'),
                },
              ]}
              hidden={item.locale !== defaultLang}
            >
              <Input />
            </Form.Item>
          ))}
        </Col>
        <Col span={12}>
          {languages.map((item) => (
            <Form.Item
              key={'description' + item.id}
              label={t('description')}
              name={`description[${item.locale}]`}
              hidden={item.locale !== defaultLang}
              rules={[
                {
                  required: item.locale === defaultLang,
                  message: t('required'),
                },
              ]}
            >
              <TextArea rows={3} />
            </Form.Item>
          ))}
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('category')}
            name='category'
            rules={[{ required: true, message: 'required' }]}
          >
            <DebounceSelect
              fetchOptions={fetchCategory}
              onSelect={(value) => {
                setSelectedCategory(value);
                form.setFieldsValue({ shop: null });
              }}
              onClear={() => {
                setSelectedCategory({});
                form.setFieldsValue({ shop: null });
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('shop')}
            name='shop'
            rules={[{ required: true, message: 'required' }]}
          >
            <DebounceSelect
              fetchOptions={fetchShops}
              disabled={!selectedCategory?.value}
              refetchOptions={true}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('price')}
            name='price'
            rules={[
              { required: true, message: 'required' },
              { type: 'number', min: 0, message: t('min.0') },
            ]}
          >
            <InputNumber
              className='w-100'
              addonAfter={defaultCurrency?.symbol}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('duration')}
            name='interval'
            rules={[
              { required: true, message: 'required' },
              { type: 'number', min: 0, message: t('min.0') },
            ]}
          >
            <InputNumber className='w-100' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('pause')}
            name='pause'
            rules={[
              {
                required: true,
                message: 'required',
              },
              { type: 'number', min: 0, message: t('min.0') },
            ]}
          >
            <InputNumber className='w-100' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('commission.fee')}
            name='commission_fee'
            rules={[
              {
                required: true,
                message: 'required',
              },
              { type: 'number', min: 0, message: t('min.0') },
            ]}
          >
            <InputNumber className='w-100' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('status')}
            name='status'
            rules={[
              {
                required: true,
                message: 'required',
              },
            ]}
          >
            <Select onChange={(e) => setSelectedStatus(e)}>
              {statuses.map((item, idx) => (
                <Select.Option value={item} key={item + idx}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('type')}
            name='type'
            rules={[
              {
                required: true,
                message: 'required',
              },
            ]}
          >
            <Select>
              {serviceTypes.map((item, idx) => (
                <Select.Option value={item} key={item + idx}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('gender')}
            name='gender'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <Select>
              {genders.map((item, idx) => (
                <Select.Option value={item.value} key={item + idx}>
                  {t(item.label)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {selectedStatus === statuses[2] && (
          <Col span={12}>
            <Form.Item
              label={t('status.note')}
              name='status_note'
              rules={[
                {
                  required: selectedStatus === statuses[2],
                  message: t('required'),
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        )}
        {/*<Col span={4}>*/}
        {/*  <Form.Item*/}
        {/*    label={t('image')}*/}
        {/*    name='image'*/}
        {/*    rules={[*/}
        {/*      {*/}
        {/*        required: !images?.length,*/}
        {/*        message: t('required'),*/}
        {/*      },*/}
        {/*    ]}*/}
        {/*  >*/}
        {/*    <MediaUpload*/}
        {/*      type='services'*/}
        {/*      imageList={images}*/}
        {/*      setImageList={setImages}*/}
        {/*      form={form}*/}
        {/*      multiple={false}*/}
        {/*      name='image'*/}
        {/*    />*/}
        {/*  </Form.Item>*/}
        {/*</Col>*/}
      </Row>
      <Space>
        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          {t('submit')}
        </Button>
      </Space>
    </Form>
  );
};

export default ServiceForm;
