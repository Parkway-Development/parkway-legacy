import { Alert, Breadcrumb, Form, Input, InputRef } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { BaseFormFooter } from '../base-data-table-page';
import UserProfileSelect from '../user-profile-select';
import MoneyDisplay from '../money-display';
import DatePicker from '../date-picker';
import {
  CreateContributionPayload,
  IndividualContributionPayload
} from '../../api';
import { getDateString } from '../../utilities';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import AccountsInput from './AccountsInput.tsx';
import { ContributionAccount, ContributionType, Deposit } from '../../types';
import { BaseSelect } from '../base-select';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AddContributionFormValues = Omit<
  IndividualContributionPayload,
  'gross'
> & {
  gross: number | undefined;
};

const ContributionTypeOptions: { label: string; value: ContributionType }[] = [
  {
    value: 'cash',
    label: 'Cash'
  },
  {
    value: 'check',
    label: 'Check'
  },
  {
    value: 'credit',
    label: 'Credit'
  },
  {
    value: 'debit',
    label: 'Debit'
  },
  {
    value: 'ach',
    label: 'ACH'
  },
  {
    value: 'wire',
    label: 'Wire'
  },
  {
    value: 'crypto',
    label: 'Crypto'
  }
];

type AddContributionFormProps = {
  isModalContext?: boolean;
  deposit?: Deposit;
  onCancel?: () => void;
};

const AddContributionForm = ({
  isModalContext,
  deposit,
  onCancel
}: AddContributionFormProps) => {
  const [accountKey, setAccountKey] = useState<number>(0);
  const grossInputRef = useRef<InputRef>(null);
  const queryClient = useQueryClient();
  const {
    contributionsApi: { create },
    formatError
  } = useApi();

  const { mutate, isPending, error, data } = useMutation({
    mutationFn: create
  });

  let errorMessage: ReactNode;

  if (error) {
    errorMessage = formatError(error);
  } else if (data?.data.failedContributions.length) {
    errorMessage = formatError(data.data.failedContributions[0].errors[0]);
  }

  const navigate = useNavigate();
  const [form] = Form.useForm<AddContributionFormValues>();

  const [isAccountBalanceValid, setIsAccountBalanceValid] =
    useState<boolean>(false);

  useEffect(() => {
    if (grossInputRef.current) {
      grossInputRef.current.focus();
    }
  }, [accountKey]);

  const gross = Form.useWatch('gross', form) ?? 0;
  const fees = Form.useWatch('fees', form) ?? 0;
  const type = Form.useWatch('type', form) ?? 0;
  const net = gross - fees;

  const [initialValues] = useState<AddContributionFormValues>(() => ({
    transactionDate: getDateString(new Date())!,
    accounts: [],
    gross: undefined,
    net: 0,
    fees: 0,
    type: 'cash',
    notes: [],
    contributorProfileId: '',
    depositId: deposit?._id,
    responsiblePartyProfileId: deposit?.responsiblePartyProfileId ?? ''
  }));

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(`/accounts/contributions`);
    }
  };

  const handleProfileChange = (value: string | undefined) => {
    form.setFieldsValue({ contributorProfileId: value });
  };

  const handleResponsiblePartyChange = (value: string | undefined) => {
    form.setFieldsValue({ responsiblePartyProfileId: value });
  };

  const handleAccountsChange = useCallback(
    (accounts: ContributionAccount[], isValid: boolean) => {
      form.setFieldsValue({
        accounts
      });

      setIsAccountBalanceValid(isValid);
    },
    [form]
  );

  const handleSave = (values: AddContributionFormValues) => {
    const gross = values.gross ?? 0;

    const payload: CreateContributionPayload = [
      {
        ...values,
        gross,
        net: gross - values.fees
      }
    ];

    mutate(payload, {
      onSuccess: (data) => {
        if (data.data.successfulContributions.length) {
          queryClient.invalidateQueries({
            queryKey: buildQueryKey(
              'contributions',
              deposit ? `depositId_${deposit._id}` : undefined
            )
          });

          form.resetFields();
          setAccountKey((prev) => prev + 1);
          setIsAccountBalanceValid(false);
        }
      }
    });
  };

  return (
    <>
      {!isModalContext && (
        <Breadcrumb
          items={[
            {
              title: <Link to="/accounts">Accounts</Link>
            },
            {
              title: <Link to="/accounts/contributions">Contributions</Link>
            },
            {
              title: 'Add Contribution'
            }
          ]}
        />
      )}
      <Form<AddContributionFormValues>
        form={form}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        onFinish={handleSave}
        autoComplete="off"
        disabled={false}
        initialValues={initialValues}
      >
        <Form.Item<AddContributionFormValues>
          label="Transaction Date"
          name="transactionDate"
          rules={[{ required: true, message: 'Transaction date is required.' }]}
        >
          <DatePicker />
        </Form.Item>

        {!isModalContext && (
          <>
            <Form.Item<AddContributionFormValues>
              label="Deposit Id"
              name="depositId"
            >
              <Input readOnly disabled />
            </Form.Item>

            <Form.Item<AddContributionFormValues>
              label="Responsible Party"
              name="responsiblePartyProfileId"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Responsible party is required.'
                }
              ]}
            >
              <UserProfileSelect
                initialValue={deposit?.responsiblePartyProfileId}
                onChange={(value: string | undefined) =>
                  handleResponsiblePartyChange(value)
                }
              />
            </Form.Item>
          </>
        )}

        <Form.Item<AddContributionFormValues>
          name="gross"
          label="Gross"
          rules={[
            {
              required: true,
              message: 'Gross amount is required.'
            }
          ]}
        >
          <Input type="number" ref={grossInputRef} />
        </Form.Item>

        <Form.Item<AddContributionFormValues>
          name="fees"
          label="Fees"
          rules={[
            {
              required: true,
              message: 'Fee amount is required.'
            }
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item<AddContributionFormValues> name="net" label="Net Amount">
          <span>{!isNaN(net) ? <MoneyDisplay pennies={net} /> : '$0.00'}</span>
        </Form.Item>

        <Form.Item<AddContributionFormValues>
          label="Contributor"
          name="contributorProfileId"
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Contributor is required.'
            }
          ]}
        >
          <UserProfileSelect
            onChange={(value: string | undefined) => handleProfileChange(value)}
          />
        </Form.Item>

        <Form.Item<AddContributionFormValues>
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Type is required.' }]}
        >
          <BaseSelect
            value={type}
            onChange={(value) => {
              if (value) {
                form.setFieldsValue({ type: value });
              }
            }}
            options={ContributionTypeOptions}
          />
        </Form.Item>

        <Form.Item<AddContributionFormValues> label="Accounts">
          <AccountsInput
            key={accountKey}
            onChange={handleAccountsChange}
            totalAmount={net}
            initialValue={undefined}
          />
        </Form.Item>

        <div style={{ display: 'none' }}>
          <Form.Item name="accounts">
            <Input />
          </Form.Item>
          {isModalContext && (
            <>
              <Form.Item name="depositId">
                <Input />
              </Form.Item>
              <Form.Item name="responsiblePartyProfileId">
                <Input />
              </Form.Item>
            </>
          )}
        </div>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            style={{ marginBottom: '1em' }}
          />
        )}

        <BaseFormFooter
          isDisabled={net === 0 || !isAccountBalanceValid}
          isLoading={isPending}
          onCancel={handleCancel}
        />
      </Form>
    </>
  );
};

export default AddContributionForm;
