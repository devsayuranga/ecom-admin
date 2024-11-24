import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Form } from 'antd';
import ServiceForm from './form';
import servicesService from 'services/seller/services';
import { useParams } from 'react-router-dom';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { disableRefetch } from 'redux/slices/menu';
import createImage from 'helpers/createImage';

const EditService = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [serviceData, setServiceData] = useState(null);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.description,
      [`short_desc[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.short_desc,
    }));
    return Object.assign({}, ...result);
  }

  const getServiceById = (id) => {
    setLoading(true);
    return servicesService
      .getById(id)
      .then(({ data }) => {
        const body = {
          ...data,
          ...getLanguageFields(data),
          image: [createImage(data.img)],
          category: {
            label: data?.category?.translation?.title,
            value: data?.category?.id,
            key: data?.category?.id,
          },
        };
        form.setFieldsValue(body);
        setServiceData(body);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      getServiceById(id);
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onFinish = (values) => {
    return servicesService.update(id, values);
  };

  return (
    <Card title={t('edit.service')} loading={loading}>
      <ServiceForm form={form} handleSubmit={onFinish} data={serviceData} />
    </Card>
  );
};

export default EditService;
