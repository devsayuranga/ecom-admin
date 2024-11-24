import { Card, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import ServiceExtraForm from './form';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch } from '../../redux/slices/menu';
import serviceExtraService from '../../services/service-extra';
import { useParams } from 'react-router-dom';
import LanguageList from '../../components/language-list';

function EditServiceExtra() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);

  const [loading, setLoading] = useState(true);

  console.log('languages', languages);

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;

    console.log('translation', translations);

    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.description,
    }));
    return Object.assign({}, ...result);
  }

  const getServiceExtraById = (id) => {
    setLoading(true);
    return serviceExtraService
      .getById(id)
      .then(({ data }) => {
        const body = {
          ...data,
          ...getLanguageFields(data),
          active: !!data.active,
          service: {
            label: data?.service?.translation?.title,
            value: data?.service?.id,
            key: data?.service?.id,
          },
        };
        form.setFieldsValue(body);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(disableRefetch(activeMenu));
      getServiceExtraById(id);
    }
  }, [activeMenu.refetch]);

  const handleSubmit = (body) => {
    return serviceExtraService.update(id, body);
  };

  return (
    <Card
      title={t('edit.service.extra')}
      loading={loading}
      extra={<LanguageList />}
    >
      {!loading && <ServiceExtraForm form={form} onSubmit={handleSubmit} />}
    </Card>
  );
}

export default EditServiceExtra;
