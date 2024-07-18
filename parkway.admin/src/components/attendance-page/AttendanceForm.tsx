import { Breadcrumb, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Attendance } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';

type AttendanceWithoutId = Omit<Attendance, '_id'>;

type AttendanceFormProps = AddBaseApiFormProps<Attendance> & {
  initialValues?: AttendanceWithoutId;
};

const AttendanceForm = ({
  isSaving,
  initialValues: initialValuesProp,
  onSave,
  onCancel
}: AttendanceFormProps) => {
  const [form] = Form.useForm<AttendanceWithoutId>();

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/attendance">Attendance</Link>
          },
          {
            title: initialValuesProp ? 'Edit Attendance' : 'Add Attendance'
          }
        ]}
      />
      <Form<AttendanceWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={onSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValuesProp}
      >
        <Form.Item<AttendanceWithoutId>
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus autoComplete="off" />
        </Form.Item>

        <Form.Item<AttendanceWithoutId>
          label="Description"
          name="description"
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

export default AttendanceForm;
