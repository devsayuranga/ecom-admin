import { Card, Form } from 'antd';
import ServiceExtraForm from './form';
import { useTranslation } from 'react-i18next';
import LanguageList from '../../components/language-list';
import React from 'react';
import serviceExtraService from '../../services/service-extra';

function CreateServiceExtra() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onSubmit = (body) => {
    return serviceExtraService.create(body);
  };
  return (
    <Card title={t('create.service.extra')} extra={<LanguageList />}>
      <ServiceExtraForm form={form} onSubmit={onSubmit} />
    </Card>
  );
}

export default CreateServiceExtra;
