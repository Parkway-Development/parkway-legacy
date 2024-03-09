import { Breadcrumb, Button, DatePicker, Form, Input, Switch } from 'antd';
import styles from './ContributionForm.module.css';
import { Link } from 'react-router-dom';
import { Contribution } from '../../types/Contribution.ts';
import { AddBaseApiFormProps } from '../base-data-table-page';
import UserProfileSelect from '../user-profile-select/UserProfileSelect.tsx';
import dayjs from 'dayjs';

type ContributionWithoutId = Omit<Contribution, '_id'>;

type ContributionFormProps = AddBaseApiFormProps<Contribution> & {
  initialValues?: ContributionWithoutId;
};

const ContributionForm = ({
  isSaving,
  initialValues: initialValuesProp,
  onSave,
  onCancel
}: ContributionFormProps) => {
  const [form] = Form.useForm<ContributionWithoutId>();

  const handleSave = (values: ContributionWithoutId) => {
    const payload: Omit<Contribution, '_id'> = {
      ...values,
      accounts: [],
      type: values.type?.trim(),
      depositBatchId: values.depositBatchId?.trim()
    };

    onSave(payload);
  };

  const initialValues = initialValuesProp
    ? {
        ...initialValuesProp,
        transactionDate: initialValuesProp.transactionDate
          ? dayjs(initialValuesProp.transactionDate, 'YYYY-MM-DD')
          : undefined,
        depositDate: initialValuesProp.depositDate
          ? dayjs(initialValuesProp.depositDate, 'YYYY-MM-DD')
          : undefined
      }
    : undefined;

  const handleProfileChange = (value: string | undefined) =>
    form.setFieldsValue({
      profile: value
    });

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/accounts">Accounts</Link>
          },
          {
            title: <Link to="/accounts/contributions">Contributions</Link>
          },
          {
            title: initialValues ? 'Edit Contribution' : 'Add Contribution'
          }
        ]}
      />
      <Form<ContributionWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<ContributionWithoutId>
          label="Total Amount"
          name="totalAmount"
          rules={[{ required: true, message: 'Total amount is required.' }]}
        >
          <Input autoFocus type="number" />
        </Form.Item>

        <Form.Item<ContributionWithoutId>
          label="Transaction Date"
          name="transactionDate"
          rules={[{ required: true, message: 'Transaction date is required.' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item<ContributionWithoutId>
          label="Deposit Date"
          name="depositDate"
        >
          <DatePicker />
        </Form.Item>

        <Form.Item<ContributionWithoutId> label="Locked" name="locked">
          <Switch />
        </Form.Item>

        <Form.Item<ContributionWithoutId>
          label="Deposit Batch Id"
          name="depositBatchId"
        >
          <Input />
        </Form.Item>

        <Form.Item<ContributionWithoutId> label="Type" name="type">
          <Input />
        </Form.Item>

        <Form.Item<ContributionWithoutId> label="Accounts" name="accounts">
          <p>Accounts coming soon...</p>
        </Form.Item>

        <Form.Item<ContributionWithoutId>
          label="User Profile"
          name="profile"
          rules={[{ required: true, message: 'User profile is required.' }]}
        >
          <UserProfileSelect
            onChange={handleProfileChange}
            initialValue={initialValues?.profile}
          />
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

export default ContributionForm;
