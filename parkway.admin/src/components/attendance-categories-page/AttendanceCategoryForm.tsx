import { Breadcrumb, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { AttendanceCategory } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';

type AttendanceCategoryWithoutId = Omit<AttendanceCategory, '_id'>;

type AttendanceFormProps = AddBaseApiFormProps<AttendanceCategory> & {
  initialValues?: AttendanceCategoryWithoutId;
};

const AttendanceCategoryForm = ({
  isSaving,
  initialValues: initialValuesProp,
  onSave,
  onCancel
}: AttendanceFormProps) => {
  const [form] = Form.useForm<AttendanceCategoryWithoutId>();

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: (
              <Link to="/attendance-categories">Attendance Categories</Link>
            )
          },
          {
            title: initialValuesProp
              ? 'Edit Attendance Category'
              : 'Add Attendance Category'
          }
        ]}
      />
      <Form<AttendanceCategoryWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={onSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValuesProp}
      >
        <Form.Item<AttendanceCategoryWithoutId>
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus autoComplete="off" />
        </Form.Item>

        <Form.Item<AttendanceCategoryWithoutId>
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

export default AttendanceCategoryForm;
