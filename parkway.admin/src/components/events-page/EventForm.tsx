import { Breadcrumb, DatePicker, Form, Input, TimePicker } from 'antd';
import { Link } from 'react-router-dom';
import UserProfileSelect from '../user-profile-select';
import { Event } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import { transformDateToDayjs } from '../../utilities';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import styles from './EventForm.module.css';

type EventWithoutId = Omit<Event, '_id'>;

type EventFormFields = Omit<EventWithoutId, 'start' | 'end'> & {
  startDate: Dayjs;
  startTime: Dayjs;
  endDate: Dayjs;
  endTime: Dayjs;
};

type EventFormProps = AddBaseApiFormProps<Event> & {
  initialValues?: EventWithoutId;
};

const EventForm = ({
  isSaving,
  initialValues,
  onSave,
  onCancel
}: EventFormProps) => {
  const [form] = Form.useForm<EventFormFields>();
  const [endTimeOpen, setEndTimeOpen] = useState<boolean>(false);

  const handleLeaderChange = (value: string | undefined) =>
    form.setFieldsValue({
      organizer: value
    });

  const initial = initialValues
    ? {
        ...initialValues,
        startDate: transformDateToDayjs(initialValues.start),
        startTime: transformDateToDayjs(initialValues.start),
        endDate: transformDateToDayjs(initialValues.end),
        endTime: transformDateToDayjs(initialValues.end)
      }
    : undefined;

  const handleSave = (values: EventFormFields) => {
    const { startDate, startTime, endDate, endTime, ...remaining } = values;

    const start = startDate.toDate();
    start.setTime(startTime.toDate().getTime());

    const end = endDate.toDate();
    end.setTime(endTime.toDate().getTime());

    const finalPayload: EventWithoutId = {
      ...remaining,
      start,
      end
    };

    onSave(finalPayload);
  };

  const validateEndDate = (_: any, value: Dayjs) => {
    const startDate: Dayjs = form.getFieldValue('startDate');
    if (value && startDate && value.date() < startDate.date()) {
      return Promise.reject('End date cannot be before the start date');
    }

    return Promise.resolve();
  };

  const validateEndTime = (_: any, value: Dayjs) => {
    const startDate: Dayjs = form.getFieldValue('startDate');
    const startTime: Dayjs = form.getFieldValue('startTime');
    const endDate: Dayjs = form.getFieldValue('endDate');

    if (
      startDate &&
      endDate &&
      startTime &&
      value &&
      startDate.date() === endDate.date() &&
      value < startTime
    ) {
      return Promise.reject('End time cannot be before the start time');
    }

    return Promise.resolve();
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/events">Events</Link>
          },
          {
            title: initialValues ? 'Edit Event' : 'Add Event'
          }
        ]}
      />
      <Form<EventFormFields>
        form={form}
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={handleSave}
        autoComplete="off"
        disabled={isSaving}
        initialValues={initial}
      >
        <Form.Item<EventFormFields>
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Required' }]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item<EventFormFields> label="Description" name="description">
          <Input />
        </Form.Item>

        <Form.Item<EventFormFields> label="Organizer" name="organizer">
          <UserProfileSelect
            onChange={handleLeaderChange}
            initialValue={initialValues?.organizer}
          />
        </Form.Item>

        <div className={styles.dateContainer}>
          <div>
            <Form.Item<EventFormFields>
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: 'Start date is required.' }]}
              labelCol={{ flex: 0 }}
              wrapperCol={{ flex: 1 }}
            >
              <DatePicker
                onChange={(value) => form.setFieldsValue({ endDate: value })}
              />
            </Form.Item>

            <Form.Item<EventFormFields>
              label="Start Time"
              name="startTime"
              rules={[{ required: true, message: 'Start time is required.' }]}
              labelCol={{ flex: 0 }}
              wrapperCol={{ flex: 1 }}
            >
              <TimePicker
                use12Hours
                format="h:mm a"
                minuteStep={15}
                onChange={(value) => {
                  const currentEndTime = form.getFieldValue('endTime');

                  if (!currentEndTime) {
                    form.setFieldsValue({ endTime: value });
                    setEndTimeOpen(true);
                  }
                }}
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item<EventFormFields>
              label="End Date"
              name="endDate"
              rules={[
                { required: true, message: 'End date is required.' },
                { validator: validateEndDate }
              ]}
              labelCol={{ flex: 0 }}
              wrapperCol={{ flex: 1 }}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item<EventFormFields>
              label="End Time"
              name="endTime"
              rules={[
                { required: true, message: 'End time is required.' },
                { validator: validateEndTime }
              ]}
              labelCol={{ flex: 0 }}
              wrapperCol={{ flex: 1 }}
            >
              <TimePicker
                use12Hours
                format="h:mm a"
                minuteStep={15}
                open={endTimeOpen}
                onOpenChange={setEndTimeOpen}
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item<EventFormFields> label="Location" name="location">
          <Input />
        </Form.Item>

        <Form.Item<EventFormFields> label="Category" name="category">
          <Input />
        </Form.Item>

        <Form.Item<EventFormFields> label="Status" name="status">
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

export default EventForm;
