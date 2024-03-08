import { Breadcrumb, Button, Form, Input } from 'antd';
import styles from './AccountForm.module.css';
import { Link } from 'react-router-dom';
import { Account } from '../../types/Account.ts';
import { AddBaseApiFormProps } from '../base-data-table-page';

type AccountWithoutId = Omit<Account, '_id'>;
type AccountFields = Omit<AccountWithoutId, 'notes'> & {
  notes: string;
};

type TeamFormProps = AddBaseApiFormProps<Account> & {
  initialValues?: AccountWithoutId;
};

const AccountForm = ({
  isSaving,
  initialValues: initialValuesProp,
  onSave,
  onCancel
}: TeamFormProps) => {
  const [form] = Form.useForm<AccountFields>();
  const initialValues = {
    ...initialValuesProp,
    notes: initialValuesProp?.notes?.length ? initialValuesProp.notes[0] : ''
  };

  const handleSave = (values: AccountFields) => {
    const payload: Omit<Account, '_id'> = {
      name: values.name.trim(),
      description: values.description?.trim(),
      targetAmount: values.targetAmount,
      currentAmount: values.currentAmount,
      notes: [values.notes]
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

        <Form.Item<AccountFields> label="Target Amount" name="targetAmount">
          <Input type="number" />
        </Form.Item>

        <Form.Item<AccountFields> label="Current Value" name="currentAmount">
          <Input type="number" />
        </Form.Item>

        <Form.Item<AccountFields> label="Notes" name="notes">
          <Input.TextArea />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3, span: 12 }}>
          <div>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSaving}
              loading={isSaving}
            >
              Submit
            </Button>
            <Button className={styles.close} onClick={onCancel}>
              Close
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default AccountForm;
