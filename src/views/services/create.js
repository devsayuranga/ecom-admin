import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Form } from 'antd';
import LanguageList from 'components/language-list';
import ServiceForm from './form';
import servicesService from 'services/services';

const CreateService = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    return servicesService.create(values);
  };

  return (
    <Card title={t('create.service')} extra={<LanguageList />}>
      <ServiceForm form={form} handleSubmit={onFinish} />
    </Card>
  );
};

export default CreateService;
