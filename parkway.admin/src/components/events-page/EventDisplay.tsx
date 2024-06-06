import { Event, RegistrationSlot } from '../../types';
import {
  Descriptions,
  DescriptionsProps,
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
      <Tabs items={tabItems} />
    </>
  );
};

interface EventScheduleSummaryProps {
  schedule: EventSchedule | undefined;
}

const EventScheduleSummary = ({ schedule }: EventScheduleSummaryProps) => {
  if (!schedule) return <span>No</span>;

  const { interval, frequency, week_days, month_weeks, end_date } = schedule;

  let result;

  if (frequency === 'custom') {
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

const registrationDisplayColumns: TableColumnsType<RegistrationSlot> = [
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
  },
  { title: 'Count', key: 'count', render: () => 'todo' }
];

const RegistrationDisplay = ({ event }: { event: Event }) => {
  const slotsToDisplay = event.registrationSlots?.filter(
    (slot) => !slot.deleted
  );

  if (!event.allowRegistrations || !slotsToDisplay?.length) {
    return <span>This event is not accepting registrations.</span>;
  }

  const expandedRowRender = () => {
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

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i.toString(),
        created: new Date(),
        profile: 'This is production name',
        event: 'Upgraded: 56',
        _id: i.toString(),
        registrationSlots: []
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  return (
    <div className={styles.registrationSlotContainer}>
      <h3>Registration Slots: ({slotsToDisplay.length})</h3>
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
