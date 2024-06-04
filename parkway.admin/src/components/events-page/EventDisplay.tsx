import { Event } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import { UserNameDisplay } from '../user-name-display';
import DateDisplay from '../date-display';
import BooleanDisplay from '../boolean-display/BooleanDisplay.tsx';

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
      label: 'Location',
      children: event.location
    },
    {
      key: 8,
      label: 'Category',
      children: event.category
    },
    {
      key: 9,
      label: 'Teams',
      children: event.teams
    }
  ];

  return (
    <Descriptions
      size="small"
      title={event.name}
      items={items}
      bordered
      column={1}
    />
  );
};

export default EventDisplay;
