import { Alert, Breadcrumb, Form, Input, Spin } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { Attendance } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { useQueries } from '@tanstack/react-query';
import DateDisplay from '../date-display';
import { Fragment } from 'react';
import { getDateString } from '../../utilities';
import { useAuth } from '../../hooks/useAuth.tsx';

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
  const {
    attendanceCategoryApi: { getAll: getAttendanceCategories },
    eventsApi: { getById: getEventById },
    formatError
  } = useApi();

  const { user } = useAuth();
  const params = useParams();
  const eventId =
    initialValuesProp?.event !== undefined &&
    typeof initialValuesProp.event !== 'string' &&
    initialValuesProp.event._id
      ? initialValuesProp.event._id
      : params.eventId;

  const [attendanceCategoriesQuery, eventDetailQuery] = useQueries({
    queries: [
      {
        queryFn: getAttendanceCategories,
        queryKey: buildQueryKey('attendanceCategory')
      },
      {
        queryFn: getEventById(eventId!),
        queryKey: buildQueryKey('events', eventId),
        enabled: eventId !== undefined
      }
    ]
  });

  const error = [attendanceCategoriesQuery, eventDetailQuery].reduce(
    (p: Error | null, c) => (p ? p : c.error),
    null
  );

  const isLoading = [attendanceCategoriesQuery, eventDetailQuery].some(
    (query) => query.isLoading
  );

  if (!eventId) {
    return <Alert type="error" message="Invalid id" />;
  }

  if (error) {
    return <Alert type="error" message={formatError(error)} />;
  }

  const attendanceCategories = attendanceCategoriesQuery.data?.data;
  const eventDetail = eventDetailQuery.data?.data;

  if (isLoading || !eventDetail) {
    return <Spin />;
  }

  if (!attendanceCategories) {
    return (
      <Alert
        type="error"
        message="No attendance categories have been configured."
      />
    );
  }

  const onSubmit = (values: AttendanceWithoutId) => {
    if (!initialValuesProp) {
      onSave({
        ...values,
        event: eventId,
        createdBy: user!.profileId!,
        created: new Date()
      });

      return;
    }

    onSave({
      ...initialValuesProp,
      total: values.total,
      categories: values.categories
    });
  };

  const updateTotal = () => {
    const categories = form.getFieldValue(
      'categories'
    ) as Attendance['categories'];

    let total = 0;

    if (categories && categories.length) {
      total = categories.reduce((acc, category) => {
        const value = Number(category.count);
        if (Number.isSafeInteger(value)) {
          return acc + value;
        }
        return acc;
      }, 0);
    }

    form.setFieldValue('total', total);
  };

  const initialValues = initialValuesProp
    ? initialValuesProp
    : {
        date: getDateString(eventDetail.start),
        categories: [],
        total: 0
      };

  initialValues.categories = attendanceCategories.map((category) => {
    const existingCategory = initialValuesProp?.categories.find(
      (x) => x.category === category._id
    );

    return {
      category: category._id,
      count: existingCategory?.count ?? 0
    };
  });

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/attendance">Attendance</Link>
          },
          {
            title: initialValuesProp
              ? 'Edit Attendance Category'
              : 'Add Attendance Category'
          }
        ]}
      />
      <Form<AttendanceWithoutId>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={onSubmit}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initialValues}
      >
        <Form.Item<AttendanceWithoutId>
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Event date is required.' }]}
        >
          <DateDisplay date={eventDetail.start} />
        </Form.Item>

        {attendanceCategories!.map((category, index) => (
          <Fragment key={category._id}>
            <Form.Item<AttendanceWithoutId>
              label={category.name}
              name={['categories', index, 'count']}
            >
              <Input type="number" onChange={updateTotal} />
            </Form.Item>
            <Form.Item<AttendanceWithoutId>
              label={category.name}
              name={['categories', index, 'category']}
              hidden
            >
              <Input />
            </Form.Item>
          </Fragment>
        ))}

        <Form.Item<AttendanceWithoutId> label="Total" name="total">
          <Input type="number" disabled />
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
