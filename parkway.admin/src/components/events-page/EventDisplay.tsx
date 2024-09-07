import { Event, RegistrationSlot } from '../../types';
import {
  Alert,
  Button,
  Descriptions,
  DescriptionsProps,
  Spin,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps
} from 'antd';
import { UserNameDisplay } from '../user-name-display';
import DateDisplay from '../date-display';
import BooleanDisplay from '../boolean-display/BooleanDisplay.tsx';
import EventCategoryDisplay from '../event-category-display';
import TeamNameDisplay from '../team-name-display';
import styles from './EventDisplay.module.scss';
import { EventSchedule } from '../../types/EventSchedule.ts';
import { monthWeekOptions, weekDayOptions } from './EventForm.tsx';
import RegisterUserModal from './RegisterUserModal.tsx';
import { EventRegistration } from '../../types/EventRegistration.ts';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const EventDisplay = (event: Event) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Description',
      children: event.description
    },
    {
      key: 2,
      label: 'Status',
      children: event.status
    },
    {
      key: 3,
      label: 'Organizer',
      children: <UserNameDisplay user={event.organizer} />
    },
    {
      key: 4,
      label: 'Start',
      children: <DateDisplay date={event.start} displayTime />
    },
    {
      key: 5,
      label: 'End',
      children: <DateDisplay date={event.end} displayTime />
    },
    {
      key: 6,
      label: 'All Day',
      children: <BooleanDisplay value={event.allDay} />
    },
    {
      key: 7,
      label: 'Repeats',
      children: <EventScheduleSummary schedule={event.schedule} />
    },
    {
      key: 8,
      label: 'Location',
      children: event.location
    },
    {
      key: 9,
      label: 'Category',
      children: <EventCategoryDisplay eventCategory={event.category} />
    },
    {
      key: 10,
      label: 'Teams',
      children: event.teams?.length ? (
        <ul>
          {event.teams?.map((t) => (
            <li key={t}>
              <TeamNameDisplay team={t} />
            </li>
          ))}
        </ul>
      ) : null
    },
    {
      key: 11,
      label: 'Allow Registrations',
      children: <BooleanDisplay value={event.allowRegistrations} />
    }
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Details',
      children: <Descriptions size="small" items={items} bordered column={1} />
    },
    {
      key: '2',
      label: 'Registrations',
      children: <RegistrationDisplay event={event} />
    }
  ];

  return (
    <>
      <h3 className={styles.title}>{event.name}</h3>
      <Link to={`/attendance/add/${event._id}`}>
        <Button className={styles.attendanceButton}>Add Attendance</Button>
      </Link>
      <Tabs items={tabItems} />
    </>
  );
};

interface EventScheduleSummaryProps {
  schedule: (EventSchedule & { end_date?: Date | string }) | undefined;
}

export const EventScheduleSummary = ({
  schedule
}: EventScheduleSummaryProps) => {
  if (!schedule) return <span>No</span>;

  const { interval, frequency, week_days, month_weeks, end_date } = schedule;

  let result;

  if (frequency === 'custom') {
    if (!month_weeks || !week_days) return 'Incomplete schedule configuration.';

    const weeks = month_weeks
      ?.map((week) => monthWeekOptions.find((o) => o.value === week)?.label)
      .filter((x) => x !== undefined)
      .join(', ');
    const days = week_days
      ?.map((day) => weekDayOptions.find((o) => o.value === day)?.label)
      .filter((x) => x !== undefined)
      .join(', ');
    result = `The ${weeks} monthly occurrences on ${days}`;
  } else {
    result = `Every ${interval} `;

    if (frequency === 'weekly') {
      result += 'week(s)';
    } else if (frequency === 'yearly') {
      result += 'year(s)';
    } else {
      result += 'month(s)';
    }
  }

  return (
    <span>
      {result}
      {end_date && (
        <>
          {' '}
          until <DateDisplay date={end_date} />
        </>
      )}
    </span>
  );
};

type RegistrationSlotWithCount = RegistrationSlot & {
  count: number;
};

const registrationDisplayColumns: TableColumnsType<RegistrationSlotWithCount> =
  [
    { title: 'Count', key: 'count', dataIndex: 'count', align: 'center' },
    { title: 'Name', key: 'name', dataIndex: 'name' },
    { title: 'Description', key: 'description', dataIndex: 'description' },
    {
      title: 'Start',
      key: 'start',
      dataIndex: 'start',
      render: (value: Date) => <DateDisplay date={value} displayTime />
    },
    {
      title: 'End',
      key: 'end',
      dataIndex: 'end',
      render: (value: Date) => <DateDisplay date={value} displayTime />
    },
    {
      title: 'Open',
      key: 'open',
      dataIndex: 'available',
      render: (value: boolean) => <BooleanDisplay value={value} />
    }
  ];

const RegistrationDisplay = ({ event }: { event: Event }) => {
  const {
    eventsApi: { getRegistrations },
    formatError
  } = useApi();
  const { data, error, isLoading } = useQuery({
    queryKey: buildQueryKey('eventRegistrations'),
    queryFn: () => getRegistrations(event)
  });

  const slotsToDisplay: RegistrationSlotWithCount[] = useMemo(() => {
    return (
      event.registrationSlots
        ?.filter((slot) => !slot.deleted)
        .sort((a, b) => (a.start < b.start ? -1 : 1))
        .map((slot) => {
          const count =
            data?.data.reduce(
              (prev, current) =>
                current.registrationSlots.includes(slot.slotId)
                  ? prev + 1
                  : prev,
              0
            ) ?? 0;

          return {
            ...slot,
            count
          };
        }) ?? []
    );
  }, [event.registrationSlots, data]);

  if (!event.allowRegistrations || !slotsToDisplay.length) {
    return <span>This event is not accepting registrations.</span>;
  }

  if (isLoading) {
    return <Spin />;
  }

  if (error) {
    return <Alert message={formatError(error)} type="error" />;
  }

  const expandedRowRender = (registrationSlot: RegistrationSlotWithCount) => {
    const columns: TableColumnsType<EventRegistration> = [
      {
        title: 'Name',
        dataIndex: 'profile',
        key: 'profile',
        render: (value: string) => <UserNameDisplay user={value} />
      },
      {
        title: 'Date',
        dataIndex: 'created',
        key: 'date',
        render: (value: Date) => <DateDisplay date={value} displayTime />
      }
    ];

    const rowData = data?.data.filter((registration) =>
      registration.registrationSlots.includes(registrationSlot.slotId)
    );

    return <Table columns={columns} dataSource={rowData} pagination={false} />;
  };

  return (
    <div>
      <span>Total Slots: {slotsToDisplay.length}</span>
      <Table
        rowKey="slotId"
        columns={registrationDisplayColumns}
        expandable={{ expandedRowRender }}
        dataSource={slotsToDisplay}
        size="small"
      />
      <RegisterUserModal slots={slotsToDisplay} eventId={event._id} />
    </div>
  );
};

export default EventDisplay;
