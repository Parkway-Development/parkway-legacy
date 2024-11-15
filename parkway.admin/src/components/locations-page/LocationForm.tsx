import { Breadcrumb, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Location } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';

type LocationWithoutId = Omit<Location, '_id'>;

type LocationFormProps = AddBaseApiFormProps<Location> & {
  initialValues?: LocationWithoutId;
};

const LocationForm = ({
  isSaving,
  initialValues,
  onSave,
  onCancel
}: LocationFormProps) => {
  const [form] = Form.useForm<LocationWithoutId>();

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/locations">Location</Link>
          },
          {
            title: initialValues ? 'Edit Location' : 'Add Location'
          }
        ]}
      />
      <Form<LocationWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={onSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<LocationWithoutId>
          label="Name"
          name="name"
          rules={[
            { required: true, whitespace: true, message: 'Name is required.' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<LocationWithoutId> label="Description" name="description">
          <Input />
        </Form.Item>

        <Form.Item<LocationWithoutId>
          label="Street Address Line 1"
          name={['address', 'streetAddress1']}
        >
          <Input />
        </Form.Item>

        <Form.Item<LocationWithoutId>
          label="Street Address Line 2"
          name={['address', 'streetAddress2']}
        >
          <Input />
        </Form.Item>

        <Form.Item<LocationWithoutId> label="City" name={['address', 'city']}>
          <Input />
        </Form.Item>

        <Form.Item<LocationWithoutId> label="State" name={['address', 'state']}>
          <Input />
        </Form.Item>

        <Form.Item<LocationWithoutId> label="Zip" name={['address', 'zip']}>
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

export default LocationForm;
