import { Breadcrumb, Checkbox, Form, Input, Radio } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserProfileSelect from '../user-profile-select';
import { Event, RegistrationSlot } from '../../types';
import { AddBaseApiFormProps, BaseFormFooter } from '../base-data-table-page';
import { getDateString, getTimeString, isDateString } from '../../utilities';
import { useCallback, useMemo, useState } from 'react';
import styles from './EventForm.module.css';
import DeleteButton from '../delete-button';
import useApi from '../../hooks/useApi.tsx';
import EventCategorySelect from '../event-category-select';
import TeamSelect from '../team-select';
import { useAuth } from '../../hooks/useAuth.tsx';
import EventStatus from './EventStatus.tsx';
import EventMessages from './EventMessages.tsx';
import { BaseSelect, BaseSelectionProps } from '../base-select';
import TimePicker, {
  getTimeSelectHours,
  getTimeSelectMinutes,
  isEndTimeAfterStart
} from '../time-picker';
import RegistrationSlotInput from './RegistrationSlotInput.tsx';
import { EventSchedule } from '../../types/EventSchedule.ts';
import DatePicker from '../date-picker';
import useDateQueryParam from '../../hooks/useDateQueryParam.ts';
import { parseISO } from 'date-fns';
import { EventScheduleSummary } from './EventDisplay.tsx';

type EventWithoutId = Omit<Event, '_id'>;

type EventFormFields = Omit<EventWithoutId, 'start' | 'end' | 'schedule'> & {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  updateSeries?: 'this' | 'future' | 'all';
  schedule: EventSchedule & {
    end_date?: Date | string;
  };
};

type EventFormProps = AddBaseApiFormProps<Event> & {
  initialValues?: EventWithoutId;
};

const frequencyOptions: BaseSelectionProps<string>['options'] = [
  {
    label: 'Weekly',
    value: 'weekly'
  },
  {
    label: 'Monthly',
    value: 'monthly'
  },
  {
    label: 'Yearly',
    value: 'yearly'
  },
  {
    label: 'Custom',
    value: 'custom'
  }
];

export const weekDayOptions: NonNullable<
  BaseSelectionProps<number>['options']
> = [
  {
    label: 'Sunday',
    value: 0
  },
  {
    label: 'Monday',
    value: 1
  },
  {
    label: 'Tuesday',
    value: 2
  },
  {
    label: 'Wednesday',
    value: 3
  },
  {
    label: 'Thursday',
    value: 4
  },
  {
    label: 'Friday',
    value: 5
  },
  {
    label: 'Saturday',
    value: 6
  }
];

export const monthWeekOptions: NonNullable<
  BaseSelectionProps<number>['options']
> = [
  {
    label: 'First',
    value: 1
  },
  {
    label: 'Second',
    value: 2
  },
  {
    label: 'Third',
    value: 3
  },
  {
    label: 'Fourth',
    value: 4
  },
  {
    label: 'Fifth',
    value: 5
  }
];

const EventForm = ({ isSaving, initialValues, onSave }: EventFormProps) => {
  const { hasClaim, user } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const addDate = useDateQueryParam();

  const {
    eventsApi: { delete: deleteById, deleteBySchedule }
  } = useApi();

  const [form] = Form.useForm<EventFormFields>();
  const frequency = Form.useWatch(['schedule', 'frequency'], form);
  const weekDays = Form.useWatch(['schedule', 'week_days'], form);
  const monthWeeks = Form.useWatch(['schedule', 'month_weeks'], form);
  const allDay = Form.useWatch('allDay', form);
  const allowRegistrations = Form.useWatch('allowRegistrations', form);
  const updateSeries = Form.useWatch('updateSeries', form);
  const startDate = Form.useWatch('startDate', form);
  const endDate = Form.useWatch('endDate', form);
  const startTime = Form.useWatch('startTime', form);
  const endTime = Form.useWatch('endTime', form);
  const schedule = Form.useWatch('schedule', form);

  const handleCancel = () =>
    id ? navigate(`/events/${id}`) : navigate(`/events`);

  const eventDates = useMemo(
    () => ({
      startDate,
      startTime,
      endDate,
      endTime
    }),
    [endDate, endTime, startDate, startTime]
  );

  const deleteFn =
    !initialValues || !updateSeries || updateSeries === 'this'
      ? deleteById
      : (id: string) => deleteBySchedule({ _id: id, updateSeries });

  const [repeats, setRepeats] = useState<boolean>(
    initialValues !== undefined && initialValues.schedule !== undefined
  );

  const eventStatusMapping: Record<string, Event['status']> = {
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
        startDate: getDateString(initialValues.start),
        startTime: getTimeString(initialValues.start),
        endDate: getDateString(initialValues.end),
        endTime: getTimeString(initialValues.end),
        schedule: initialValues.schedule
          ? {
              ...initialValues.schedule,
              end_date: getDateString(initialValues.schedule?.end_date)
            }
          : undefined,
        updateSeries: 'this'
      }
    : addDate
      ? {
          startDate: getDateString(addDate),
          endDate: getDateString(addDate),
          status: eventStatusMapping['Tentative'],
          organizer: user!.profileId,
          allDay: false,
          schedule: undefined,
          startTime: undefined,
          endTime: undefined
        }
      : {
          status: eventStatusMapping['Tentative'],
          organizer: user!.profileId,
          allDay: false,
          schedule: undefined,
          startTime: undefined,
          endTime: undefined
        };

  const isCalendarAdmin = hasClaim('calendarManagement');

  const handleSave = (values: EventFormFields) => {
    const { startDate, startTime, endDate, endTime, allDay, ...remaining } =
      values;

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (allDay) {
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);

      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
    } else {
      start.setHours(getTimeSelectHours(startTime));
      start.setMinutes(getTimeSelectMinutes(startTime));
      start.setSeconds(0);

      end.setHours(getTimeSelectHours(endTime));
      end.setMinutes(getTimeSelectMinutes(endTime));
      end.setSeconds(0);
    }

    if (remaining.allowRegistrations && !remaining.registrationSlots?.length) {
      remaining.registrationSlots = [
        {
          slotId: crypto.randomUUID(),
          start,
          end,
          name: 'General Registration',
          available: true
        }
      ];
    }

    const finalPayload: EventWithoutId = {
      ...remaining,
      allDay,
      start,
      end,
      schedule: remaining.schedule
        ? {
            ...remaining.schedule,
            end_date: isDateString(remaining.schedule.end_date)
              ? parseISO(remaining.schedule.end_date as string)
              : undefined
          }
        : undefined
    };

    onSave(finalPayload);
  };

  const validateEndDate = (_: unknown, value: string) => {
    const startDate = form.getFieldValue('startDate');
    if (value && startDate && new Date(value) < new Date(startDate)) {
      return Promise.reject('End date cannot be before the start date');
    }

    return Promise.resolve();
  };

  const validateEndTime = (_: unknown, value: string) => {
    const startDate: string = form.getFieldValue('startDate');
    const startTime: string = form.getFieldValue('startTime');
    const endDate: string = form.getFieldValue('endDate');

    if (
      startDate &&
      endDate &&
      startTime &&
      value &&
      startDate == endDate &&
      !isEndTimeAfterStart(startTime, value)
    ) {
      return Promise.reject('End time must be after the start time');
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

  const handleRegistrationSlotsChange = useCallback(
    (registrationSlots: RegistrationSlot[]) => {
      form.setFieldsValue({
        registrationSlots
      });
    },
    [form]
  );

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
              hasSchedule={!!initial.schedule}
              status={initial.status}
              isCalendarAdmin={isCalendarAdmin}
              eventId={id!}
              userId={user!.profileId!}
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
                onChange={(e) =>
                  form.setFieldsValue({
                    endDate: e.target.value
                  })
                }
              />
            </Form.Item>

            {!allDay && (
              <Form.Item<EventFormFields>
                label="Start Time"
                name="startTime"
                rules={
                  !allDay
                    ? [{ required: true, message: 'Start time is required.' }]
                    : undefined
                }
                labelCol={{ flex: 0 }}
                wrapperCol={{ flex: 1 }}
              >
                <TimePicker />
              </Form.Item>
            )}
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

            {!allDay && (
              <Form.Item<EventFormFields>
                label="End Time"
                name="endTime"
                rules={
                  !allDay
                    ? [
                        { required: true, message: 'End time is required.' },
                        { validator: validateEndTime }
                      ]
                    : undefined
                }
                labelCol={{ flex: 0 }}
                wrapperCol={{ flex: 1 }}
              >
                <TimePicker />
              </Form.Item>
            )}
          </div>
          <div>
            <Form.Item<EventFormFields>
              label="All Day"
              name="allDay"
              labelCol={{ flex: 0 }}
              wrapperCol={{ flex: 1 }}
            >
              <Checkbox
                checked={allDay}
                onChange={(e) =>
                  form.setFieldsValue({ allDay: e.target.checked })
                }
              />
            </Form.Item>
          </div>
        </div>

        {!initialValues && (
          <Form.Item<EventFormFields> label="Repeats">
            <Checkbox
              checked={repeats}
              onChange={() =>
                setRepeats((prev) => {
                  if (prev) {
                    form.setFieldsValue({ schedule: undefined });
                  }

                  return !prev;
                })
              }
            />
          </Form.Item>
        )}

        {repeats && (
          <>
            <Form.Item<EventFormFields>
              label="Frequency"
              name={['schedule', 'frequency']}
              rules={[{ required: true, message: 'Frequency is required.' }]}
            >
              <BaseSelect
                value={frequency}
                onChange={(value) => {
                  if (
                    value === 'monthly' ||
                    value === 'weekly' ||
                    value === 'yearly' ||
                    value === 'custom'
                  ) {
                    form.setFieldsValue({
                      schedule: {
                        frequency: value,
                        interval: 1,
                        week_days: undefined,
                        month_weeks: undefined
                      }
                    });
                  } else {
                    form.setFieldsValue({
                      schedule: undefined
                    });
                  }
                }}
                options={frequencyOptions}
              />
            </Form.Item>
            {frequency && (
              <Form.Item<EventFormFields>
                label="Repeat Interval"
                name={['schedule', 'interval']}
                hidden={frequency === 'custom'}
                rules={[{ required: true, message: 'Interval is required.' }]}
              >
                <Input type="number" />
              </Form.Item>
            )}
            {frequency === 'custom' && (
              <>
                <Form.Item<EventFormFields>
                  label="Month Weeks"
                  name={['schedule', 'month_weeks']}
                  rules={[
                    { required: true, message: 'Week numbers are required.' }
                  ]}
                >
                  <BaseSelect<number[]>
                    isMultiSelect
                    value={monthWeeks}
                    onChange={(value) => {
                      form.setFieldsValue({
                        schedule: {
                          month_weeks:
                            value
                              ?.filter((x) => !Number.isNaN(x))
                              .map((x) => Number(x)) ?? []
                        }
                      });
                    }}
                    options={monthWeekOptions}
                  />
                </Form.Item>
                <Form.Item<EventFormFields>
                  label="Week Days"
                  name={['schedule', 'week_days']}
                  rules={[
                    { required: true, message: 'Week days are required.' }
                  ]}
                >
                  <BaseSelect<number[]>
                    isMultiSelect
                    value={weekDays}
                    onChange={(value) => {
                      form.setFieldsValue({
                        schedule: {
                          week_days:
                            value
                              ?.filter((x) => !Number.isNaN(x))
                              .map((x) => Number(x)) ?? []
                        }
                      });
                    }}
                    options={weekDayOptions}
                  />
                </Form.Item>
              </>
            )}
            <Form.Item<EventFormFields>
              label="Repeat Until"
              name={['schedule', 'end_date']}
            >
              <DatePicker />
            </Form.Item>
            {frequency && (
              <Form.Item label="Repeat Summary">
                <EventScheduleSummary schedule={schedule} />
              </Form.Item>
            )}
          </>
        )}

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

        <Form.Item<EventFormFields>
          label="Allow Registrations"
          name="allowRegistrations"
        >
          <Checkbox
            checked={allowRegistrations}
            onChange={(e) =>
              form.setFieldsValue({ allowRegistrations: e.target.checked })
            }
          />
        </Form.Item>

        {allowRegistrations && (
          <Form.Item<EventFormFields>
            label="Registration Slots"
            name="registrationSlots"
          >
            <RegistrationSlotInput
              onChange={handleRegistrationSlotsChange}
              initialValue={initialValues?.registrationSlots ?? []}
              eventDates={eventDates}
            />
          </Form.Item>
        )}

        {initialValues?.schedule && (
          <Form.Item<EventFormFields> label="Series Update" name="updateSeries">
            <Radio.Group>
              <Radio.Button value="this">Only this event</Radio.Button>
              <Radio.Button value="future">This and future events</Radio.Button>
              <Radio.Button value="all">All events</Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}

        <BaseFormFooter
          isDisabled={isSaving}
          isLoading={isSaving}
          onCancel={handleCancel}
        >
          {initialValues && id && (
            <DeleteButton
              id={id}
              deleteFn={deleteFn}
              onSuccess={handleCancel}
              isIconButton={false}
            />
          )}
        </BaseFormFooter>
      </Form>
      {initialValues && id && (
        <EventMessages eventId={id} messages={initialValues.messages} />
      )}
    </>
  );
};

export default EventForm;
