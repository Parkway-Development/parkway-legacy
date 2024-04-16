import { Breadcrumb, DatePicker, Form, Input, TimePicker } from 'antd';
import { Link, useParams } from 'react-router-dom';
import UserProfileSelect from '../user-profile-select';
import { Event } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import { isSameDate, transformDateToDayjs } from '../../utilities';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import styles from './EventForm.module.css';
import DeleteButton from '../delete-button';
import useApi from '../../hooks/useApi.ts';
import EventCategorySelect from '../event-category-select';
import TeamSelect from '../team-select';
import { useAuth } from '../../hooks/useAuth.tsx';
import EventStatus from './EventStatus.tsx';

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
  const { hasClaim, user } = useAuth();
  const params = useParams();
  const id = params.id;
  const searchParams = new URLSearchParams(window.location.search);
  const date = searchParams.get('date');
  const addDate = date
    ? transformDateToDayjs(new Date(date.replace(/-/g, '/')))
    : undefined;

  const {
    eventsApi: { delete: deleteFn }
  } = useApi();
  const [form] = Form.useForm<EventFormFields>();
  const [endTimeOpen, setEndTimeOpen] = useState<boolean>(false);

  const eventStatusMapping: Record<string, string> = {
    Tentative: 'Tentative',
    Active: 'Active',
    Rejected: 'Rejected'
  };

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
    : addDate
      ? {
          startDate: addDate,
          endDate: addDate,
          status: eventStatusMapping['Tentative'],
          organizer: user!.profileId
        }
      : {
          status: eventStatusMapping['Tentative'],
          organizer: user!.profileId
        };

  const isCalendarAdmin = hasClaim('calendarManagement');

  const handleSave = (values: EventFormFields) => {
    const { startDate, startTime, endDate, endTime, ...remaining } = values;

    const start = startDate.toDate();
    start.setHours(startTime.hour());
    start.setMinutes(startTime.minute());
    start.setSeconds(0);

    const end = endDate.toDate();
    end.setHours(endTime.hour());
    end.setMinutes(endTime.minute());
    end.setSeconds(0);

    const finalPayload: EventWithoutId = {
      ...remaining,
      start,
      end
    };

    onSave(finalPayload);
  };

  const validateEndDate = (_: any, value: Dayjs) => {
    const startDate: Dayjs = form.getFieldValue('startDate');
    if (value && startDate && value < startDate) {
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
      isSameDate(startDate.toDate(), endDate.toDate()) &&
      value <= startTime
    ) {
      return Promise.reject('End time cannot be after the start time');
    }

    return Promise.resolve();
  };

  const handleCategoryChange = (value?: string) => {
    form.setFieldsValue({
      category: value
    });
  };

  const handleTeamsChange = (values?: string[]) => {
    form.setFieldsValue({
      teams: values
    });
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
          <Input autoFocus autoComplete="off" />
        </Form.Item>

        {initialValues && (
          <Form.Item<EventFormFields> label="Status" name="status">
            <EventStatus
              status={initial.status}
              isCalendarAdmin={isCalendarAdmin}
            />
          </Form.Item>
        )}

        <Form.Item<EventFormFields> label="Description" name="description">
          <Input />
        </Form.Item>

        {isCalendarAdmin && (
          <Form.Item<EventFormFields> label="Organizer" name="organizer">
            <UserProfileSelect
              onChange={handleLeaderChange}
              initialValue={initial?.organizer}
            />
          </Form.Item>
        )}

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
          <EventCategorySelect
            value={initialValues?.category}
            onChange={handleCategoryChange}
          />
        </Form.Item>

        <Form.Item<EventFormFields> label="Teams" name="teams">
          <TeamSelect
            isMultiSelect
            value={initialValues?.teams}
            onChange={handleTeamsChange}
          />
        </Form.Item>

        <BaseFormFooter
          isDisabled={isSaving}
          isLoading={isSaving}
          onCancel={onCancel}
        >
          {initialValues && id && (
            <DeleteButton
              id={id}
              deleteFn={deleteFn}
              onSuccess={onCancel}
              isIconButton={false}
            />
          )}
        </BaseFormFooter>
      </Form>
    </>
  );
};

export default EventForm;
