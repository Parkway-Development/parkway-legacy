import { Breadcrumb, Form, Input } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { Deposit, DepositStatus } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import { useAuth } from '../../hooks/useAuth.tsx';
import { ReactNode } from 'react';

type DepositWithoutId = Omit<Deposit, '_id'> & {
  statusDate: Date | string;
};

type DepositFormProps = AddBaseApiFormProps<Deposit> & {
  initialValues?: DepositWithoutId;
};

const DepositForm = ({
  isSaving,
  initialValues,
  onSave,
  onCancel
}: DepositFormProps) => {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id;
  const [form] = Form.useForm<DepositWithoutId>();

  const handleSave = (values: DepositWithoutId) => {
    const payload = {
      ...values,
      responsiblePartyProfileId: user?.profileId ?? ''
    };

    onSave(payload);
  };

  let content: ReactNode;

  if (initialValues?.currentStatus === DepositStatus.Processed) {
    content = (
      <p>
        This deposit has already been processed and cannot be edited.
        <Link to={`/accounts/deposits/${id}`}>View Deposit</Link>
      </p>
    );
  } else {
    content = (
      <Form<DepositWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<DepositWithoutId>
          label="Amount"
          name="amount"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus type="number" />
        </Form.Item>

        <BaseFormFooter
          isDisabled={isSaving}
          isLoading={isSaving}
          onCancel={onCancel}
        />
      </Form>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/accounts">Accounts</Link>
          },
          {
            title: <Link to="/accounts/deposits">Deposits</Link>
          },
          {
            title: initialValues ? 'Edit Deposit' : 'Add Deposit'
          }
        ]}
      />
      {content}
    </>
  );
};

export default DepositForm;
