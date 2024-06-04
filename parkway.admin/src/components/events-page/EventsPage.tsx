import { Event } from '../../types';
import { UserNameDisplay } from '../user-name-display';
import { BaseApiDataTablePage } from '../base-data-table-page';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import DateDisplay from '../date-display';
import { useState } from 'react';
import Calendar from './Calendar.tsx';
import { Switch } from 'antd';
import { EventCategoryDisplayById } from '../event-categories-page/EventCategoryDisplayById.tsx';
import styles from './EventsPage.module.css';
import { Link } from 'react-router-dom';

const eventColumns: OrderedColumnsType<Event> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    displayOrder: 1,
    render: (value: Event['name'], event) => (
      <Link to={`/events/${event._id}`}>{value}</Link>
    )
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    displayOrder: 2
  },
  {
    title: 'Organizer',
    dataIndex: 'organizer',
    render: (value: Event['organizer']) => <UserNameDisplay user={value} />,
    key: 'organizer',
    displayOrder: 3
  },
  {
    title: 'Start',
    dataIndex: 'start',
    render: (value: Event['start']) => <DateDisplay date={value} displayTime />,
    key: 'start',
    displayOrder: 4
  },
  {
    title: 'End',
    dataIndex: 'end',
    render: (value: Event['end']) => <DateDisplay date={value} displayTime />,
    key: 'end',
    displayOrder: 5
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    displayOrder: 6
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (value: Event['category']) => (
      <EventCategoryDisplayById id={value} isSmall />
    ),
    displayOrder: 7
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    displayOrder: 8
  },
  {
    title: 'Teams',
    dataIndex: 'teams',
    key: 'teams',
    displayOrder: 9,
    render: (value: Event['teams']) => value?.length ?? 0
  }
];

const EventsPage = () => {
  const [showCalendar, setShowCalendar] = useState<boolean>(true);

  const content = showCalendar ? (
    <Calendar />
  ) : (
    <BaseApiDataTablePage
      queryKey="events"
      baseApiType="eventsApi"
      columns={eventColumns}
      responsiveCardRenderer={(item) => item.name}
      mainPage="/events"
    />
  );

  return (
    <div>
      <h2>Events</h2>
      <Switch
        title="Toggle Calendar"
        onChange={setShowCalendar}
        value={showCalendar}
        checkedChildren={<span>Show List</span>}
        unCheckedChildren={<span>Show Calendar</span>}
        className={styles.switch}
      />
      {content}
    </div>
  );
};

export default EventsPage;
