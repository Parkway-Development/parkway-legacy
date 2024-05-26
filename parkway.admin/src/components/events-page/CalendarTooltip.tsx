import { Event } from '../../types';
import { isSameDate, transformToTime } from '../../utilities';
import DateDisplay from '../date-display';
import styles from './CalendarTooltip.module.css';

interface CalendarTooltipProps {
  event: Event;
}

const CalendarTooltip = ({ event }: CalendarTooltipProps) => {
  const timeFormat = isSameDate(event.start, event.end) ? (
    <p>
      {transformToTime(event.start)} - {transformToTime(event.end)}
    </p>
  ) : (
    <>
      <p>
        Start: <DateDisplay date={event.start} displayTime />
      </p>
      <p>
        End: <DateDisplay date={event.end} displayTime />
      </p>
    </>
  );

  return (
    <div className={styles.tooltip}>
      <p>{event.name}</p>
      {timeFormat}
    </div>
  );
};

export default CalendarTooltip;
