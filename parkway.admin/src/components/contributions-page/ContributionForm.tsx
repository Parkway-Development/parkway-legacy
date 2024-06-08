import { Breadcrumb, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Contribution, ContributionAccount } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import UserProfileSelect from '../user-profile-select';
import { transformDateToDayjs } from '../../utilities';
import AccountsInput from './AccountsInput.tsx';
import { useState } from 'react';
import MoneyDisplay from '../money-display';
import DatePickerExtended from '../date-picker-extended';

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
  const grossAmount = Form.useWatch('gross', form);
  const feesAmount = Form.useWatch('fees', form);
  const netAmount = grossAmount - feesAmount;

  const [isAccountBalanceValid, setIsAccountBalanceValid] =
    useState<boolean>(false);

  const initialValues = initialValuesProp
    ? {
        ...initialValuesProp,
        transactionDate: transformDateToDayjs(initialValuesProp.transactionDate)
      }
    : {
        fees: 0,
        profile: undefined,
        accounts: undefined
      };

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

  const handleSave = (values: ContributionWithoutId) => {
    if (isNaN(netAmount) || netAmount <= 0) {
      return false;
    }

    const finalPayload = {
      ...values,
      net: netAmount
    };

    onSave(finalPayload);
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
        onFinish={handleSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<ContributionWithoutId>
          label="Gross Amount"
          name="gross"
          rules={[{ required: true, message: 'Gross amount is required.' }]}
        >
          <Input autoFocus type="number" step={0.01} />
        </Form.Item>

        <Form.Item<ContributionWithoutId>
          label="Fees"
          name="fees"
          rules={[{ required: true, message: 'Fee amount is required.' }]}
        >
          <Input type="number" step={0.01} />
        </Form.Item>

        <Form.Item<ContributionWithoutId> label="Net Amount" name="net">
          <span>
            {!isNaN(netAmount) ? <MoneyDisplay money={netAmount} /> : '$0.00'}
          </span>
        </Form.Item>

        <Form.Item<ContributionWithoutId>
          label="Transaction Date"
          name="transactionDate"
          rules={[{ required: true, message: 'Transaction date is required.' }]}
        >
          <DatePickerExtended />
        </Form.Item>

        <Form.Item<ContributionWithoutId> label="Deposit Id" name="depositId">
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
            totalAmount={netAmount}
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
