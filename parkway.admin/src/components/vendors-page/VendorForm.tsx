import { Breadcrumb, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import { Vendor } from '../../types';

type VendorWithoutId = Omit<Vendor, '_id'>;

type VendorFormProps = AddBaseApiFormProps<Vendor> & {
  initialValues?: VendorWithoutId;
};

const FormItem = Form.Item<VendorWithoutId>;

const VendorForm = ({
  isSaving,
  initialValues,
  onSave,
  onCancel
}: VendorFormProps) => {
  const [form] = Form.useForm<VendorWithoutId>();

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/accounts">Accounts</Link>
          },
          {
            title: <Link to="/accounts/vendors">Vendors</Link>
          },
          {
            title: initialValues ? 'Edit Vendor' : 'Add Vendor'
          }
        ]}
      />
      <Form<VendorWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={onSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <FormItem
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus />
        </FormItem>

        <FormItem label="Address" name="address">
          <Input />
        </FormItem>

        <FormItem label="City" name="city">
          <Input />
        </FormItem>

        <FormItem label="State" name="state">
          <Input />
        </FormItem>

        <FormItem label="Zip" name="zip">
          <Input />
        </FormItem>

        <FormItem label="Phone" name="phone">
          <Input />
        </FormItem>

        <FormItem
          label="Email"
          name="email"
          rules={[{ type: 'email', message: 'Invalid email' }]}
        >
          <Input />
        </FormItem>

        <FormItem label="Website" name="website">
          <Input />
        </FormItem>

        <FormItem label="Contact" name="contact">
          <Input />
        </FormItem>

        <FormItem label="Contact Phone" name="contactPhone">
          <Input />
        </FormItem>

        <FormItem label="Contact Email" name="contactEmail">
          <Input />
        </FormItem>

        <FormItem label="Notes" name="notes">
          <Input />
        </FormItem>

        <BaseFormFooter
          isDisabled={isSaving}
          isLoading={isSaving}
          onCancel={onCancel}
        />
      </Form>
    </>
  );
};

export default VendorForm;
