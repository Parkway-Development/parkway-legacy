import { Event } from '../../types';
import { UserNameDisplayById } from '../user-name-display';
import { BaseApiDataTablePage } from '../base-data-table-page';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import DateDisplay from '../date-display';

const eventColumns: OrderedColumnsType<Event> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    displayOrder: 1
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
    render: (value: Event['organizer']) => <UserNameDisplayById id={value} />,
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
    displayOrder: 7
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    displayOrder: 8
  }
];

const EventsPage = () => (
  <BaseApiDataTablePage
    queryKey="events"
    baseApiType="eventsApi"
    columns={eventColumns}
    title="Events"
  />
);

export default EventsPage;
