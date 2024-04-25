import { Breadcrumb, DatePicker, Form, Input, Switch } from 'antd';
import { Link } from 'react-router-dom';
import { Contribution, ContributionAccount } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import UserProfileSelect from '../user-profile-select';
import { transformDateToDayjs } from '../../utilities';
import AccountsInput from './AccountsInput.tsx';
import { useState } from 'react';

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
  const totalAmount = Form.useWatch('totalAmount', form);
  const [isAccountBalanceValid, setIsAccountBalanceValid] =
    useState<boolean>(false);

  const initialValues = initialValuesProp
    ? {
        ...initialValuesProp,
        transactionDate: transformDateToDayjs(
          initialValuesProp.transactionDate
        ),
        depositDate: transformDateToDayjs(initialValuesProp.depositDate)
      }
    : undefined;

  const handleProfileChange = (value: string | undefined) =>
    form.setFieldsValue({
      profile: value
    });

  const handleAccountsChange = (
    accounts: ContributionAccount[],
    isValid: boolean
  ) => {
    form.setFieldsValue({
      accounts
    });

    setIsAccountBalanceValid(isValid);
  };

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
        onFinish={onSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<ContributionWithoutId>
          label="Total Amount"
          name="totalAmount"
          rules={[{ required: true, message: 'Total amount is required.' }]}
        >
          <Input autoFocus type="number" step={0.01} />
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

        <Form.Item<ContributionWithoutId>
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Type is required.' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<ContributionWithoutId> label="Accounts" name="accounts">
          <AccountsInput
            onChange={handleAccountsChange}
            totalAmount={totalAmount}
            initialValue={initialValues?.accounts}
          />
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

        <BaseFormFooter
          isDisabled={isSaving || !isAccountBalanceValid}
          isLoading={isSaving}
          onCancel={onCancel}
        />
      </Form>
    </>
  );
};

export default ContributionForm;
