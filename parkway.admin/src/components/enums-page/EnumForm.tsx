import { Breadcrumb, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Enum } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import EnumValuesInput from './EnumValuesInput.tsx';

type EnumWithoutId = Omit<Enum, '_id'>;

type EnumFormProps = AddBaseApiFormProps<Enum> & {
  initialValues?: EnumWithoutId;
};

const EnumForm = ({
  isSaving,
  initialValues,
  onSave,
  onCancel
}: EnumFormProps) => {
  const [form] = Form.useForm<EnumWithoutId>();

  const handleValuesChange = (values: Enum['values']) => {
    form.setFieldsValue({
      values
    });
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: 'Platform'
          },
          {
            title: <Link to="/platform/enums">Enums</Link>
          },
          {
            title: initialValues ? 'Edit Edit' : 'Add Enum'
          }
        ]}
      />
      <Form<EnumWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={onSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<EnumWithoutId>
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus autoComplete="off" />
        </Form.Item>

        <Form.Item<EnumWithoutId> label="Values" name="values">
          <EnumValuesInput
            onChange={handleValuesChange}
            initialValue={initialValues?.values}
          />
        </Form.Item>

        <BaseFormFooter
          isDisabled={isSaving}
          isLoading={isSaving}
          onCancel={onCancel}
        />
      </Form>
    </>
  );
};

export default EnumForm;
