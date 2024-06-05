import { Event } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import { UserNameDisplay } from '../user-name-display';
import DateDisplay from '../date-display';
import BooleanDisplay from '../boolean-display/BooleanDisplay.tsx';
import EventCategoryDisplay from '../event-category-display';
import TeamNameDisplay from '../team-name-display';
import styles from './EventDisplay.module.scss';

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
      // TODO: Fill out schedule details here
      children: event.schedule ? 'Has schedule' : 'No'
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

  let registrationSlots = null;
  const slotsToDisplay = event.registrationSlots?.filter(
    (slot) => !slot.deleted
  );

  if (event.allowRegistrations && slotsToDisplay?.length) {
    const rows = slotsToDisplay.map((input) => {
      return (
        <tr key={input.slotId}>
          <td>{input.name}</td>
          <td>{input.description}</td>
          <td>
            <DateDisplay date={input.start} displayTime />
          </td>
          <td>
            <DateDisplay date={input.end} displayTime />
          </td>
          <td>
            <BooleanDisplay value={input.available} />
          </td>
        </tr>
      );
    });

    registrationSlots = (
      <div className={styles.registrationSlotContainer}>
        <h3>Registration Slots: ({slotsToDisplay.length})</h3>
        <table className={styles.registrationSlots}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th className={styles.dateColumn}>Start</th>
              <th className={styles.dateColumn}>End</th>
              <th className={styles.openColumn}>Open</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <Descriptions
        size="small"
        title={event.name}
        items={items}
        bordered
        column={1}
      />
      {registrationSlots}
    </>
  );
};

export default EventDisplay;
