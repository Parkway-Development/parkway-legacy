import { Breadcrumb, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Account } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';

type AccountWithoutId = Omit<Account, '_id'>;
type AccountFields = Pick<Account, 'name' | 'description' | 'type' | 'subtype'>;

type AccountFormProps = AddBaseApiFormProps<Account> & {
  initialValues?: AccountWithoutId;
};

const AccountForm = ({
  isSaving,
  initialValues: initialValuesProp,
  onSave,
  onCancel
}: AccountFormProps) => {
  const [form] = Form.useForm<AccountFields>();
  const initialValues = {
    ...initialValuesProp,
    notes: initialValuesProp?.notes?.length ? initialValuesProp.notes[0] : ''
  };

  const handleSave = (values: AccountFields) => {
    const payload: AccountWithoutId = {
      ...values
    };

    onSave(payload);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/accounts">Accounts</Link>
          },
          {
            title: initialValues ? 'Edit Account' : 'Add Account'
          }
        ]}
      />
      <Form<AccountFields>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<AccountFields>
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item<AccountFields> label="Description" name="description">
          <Input />
        </Form.Item>

        <Form.Item<AccountFields>
          label="Type"
          name="type"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<AccountFields>
          label="Sub Type"
          name="subtype"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input />
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

export default AccountForm;
