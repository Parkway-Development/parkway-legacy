import { Event } from '../../types';
import { ReactNode } from 'react';
import { Button, Empty, Tooltip } from 'antd';
import styles from './DayViewCalendar.module.css';
import { Link } from 'react-router-dom';
import CalendarTooltip from './CalendarTooltip.tsx';

type DayViewCalendarProps = {
  events: Event[];
  date: Date;
  dateParam: string;
};

const DayViewCalendar = ({ events, date, dateParam }: DayViewCalendarProps) => {
  let content: ReactNode;

  if (!events.length) {
    content = <Empty />;
  } else {
    const earliestHour = events.reduce((prev, currentValue) => {
      const itemHours = new Date(currentValue.start).getHours();
      return itemHours < prev ? itemHours : prev;
    }, 24);

    const latestHour = events.reduce((prev, currentValue) => {
      const itemHours = new Date(currentValue.end).getHours();
      return itemHours > prev ? itemHours : prev;
    }, 0);

    const startingHour = Math.max(0, earliestHour - 1);
    const endingHour = Math.max(0, latestHour + 1);

    const hours: number[] = [];

    for (let i = startingHour; i <= endingHour; i++) {
      hours.push(i);
    }

    const getGridRowValue = (event: Event): string => {
      const startEvent = new Date(event.start);
      const endEvent = new Date(event.end);
      const rowValue =
        (startEvent.getHours() - startingHour) * 4 +
        1 +
        startEvent.getMinutes() / 15;
      const rowSpan =
        (endEvent.valueOf() - startEvent.valueOf()) / 1000 / 60 / 15;

      return `${rowValue} / span ${rowSpan}`;
    };

    content = (
      <div
        className={styles.dayViewContainer}
        style={{
          gridTemplateColumns: '100px 1fr 1fr',
          gridTemplateRows: `repeat(${4 * (endingHour - startingHour + 1)}, 1em)`
        }}
      >
        {hours.map((hour, index) => (
          <div
            key={hour}
            className={styles.hourLabel}
            style={{ gridRow: `${index * 4 + 1} / span 4` }}
          >
            {hour > 12
              ? `${hour - 12} PM`
              : hour === 12
                ? '12 PM '
                : `${hour} AM`}
          </div>
        ))}
        {events.map((event) => (
          <Tooltip key={event._id} title={<CalendarTooltip event={event} />}>
            <div
              className={styles.eventItem}
              style={{ gridRow: getGridRowValue(event), gridColumn: 2 }}
            >
              {event.name}
            </div>
          </Tooltip>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.dayView}>
      <div className={styles.header}>
        <h3>Date: {date.toLocaleDateString()}</h3>
        <Link to="/events">Back to Monthly View</Link>
      </div>
      <nav className={styles.nav}>
        <Link to={`/events/add?date=${dateParam}`}>
          <Button type="primary">Add Event</Button>
        </Link>
      </nav>
      {content}
    </div>
  );
};

export default DayViewCalendar;
