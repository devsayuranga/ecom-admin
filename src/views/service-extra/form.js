import { Button, Col, Form, Input, Row, Switch } from 'antd';
import { DebounceSelect } from '../../components/search';
import React, { useState } from 'react';
import servicesService from '../../services/services';
import { useTranslation } from 'react-i18next';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { removeFromMenu } from '../../redux/slices/menu';
import { fetchServiceExtra } from '../../redux/slices/service-extra';

function ServiceExtraForm({ form, onSubmit }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { state } = useLocation();
  const [loadingBtn, setLoadingBtn] = useState(false);

  const fetchServices = (search = '') => {
    const params = {
      search,
      perPage: 10,
      page: 1,
    };

    if (!search?.trim()) delete params?.search;

    return servicesService.getAll(params).then((res) =>
      res?.data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  function getTranslationFields(values, field = 'title') {
    const list = languages.map((item) => ({
      [item.locale]: values[`${field}[${item.locale}]`],
    }));
    return Object.assign({}, ...list);
  }

  const onFinish = (values) => {
    console.log('values', values);
    setLoadingBtn(true);
    const body = {
      active: values.active ? 1 : 0,
      service_id: values.service.value,
      title: getTranslationFields(values, 'title'),
      description: getTranslationFields(values, 'description'),
    };

    onSubmit(body)
      .then(() => {
        const nextUrl = 'service-extra';

        toast.success(t('successfully.created'));
        form.resetFields();

        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchServiceExtra(state?.params));
        });

        navigate(`/${nextUrl}`);
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={onFinish}
      initialValues={{ active: true }}
    >
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label={t('service')}
            name='service'
            rules={[{ required: true, message: 'required' }]}
          >
            <DebounceSelect
              fetchOptions={fetchServices}
              refetchOptions={true}
            />
          </Form.Item>
        </Col>
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
        <Col>
          <Form.Item label={t('active')} name='active' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Button type='primary' htmlType='submit' loading={loadingBtn}>
        {t('submit')}
      </Button>
    </Form>
  );
}

export default ServiceExtraForm;
