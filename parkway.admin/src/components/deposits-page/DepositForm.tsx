import { Breadcrumb, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Deposit } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import UserProfileSelect from '../user-profile-select';

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
  const [form] = Form.useForm<DepositWithoutId>();

  const handleResponsiblePartyChange = (value: string | undefined) =>
    form.setFieldsValue({
      responsiblePartyProfileId: value
    });

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
      <Form<DepositWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={onSave}
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

        <Form.Item<DepositWithoutId>
          label="Responsible Party"
          name="responsiblePartyProfileId"
          rules={[{ required: true, message: 'Required' }]}
        >
          <UserProfileSelect
            onChange={handleResponsiblePartyChange}
            initialValue={initialValues?.responsiblePartyProfileId}
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

export default DepositForm;
