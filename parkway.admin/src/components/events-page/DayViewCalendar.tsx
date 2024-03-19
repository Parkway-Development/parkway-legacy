import { Event } from '../../types';
import { ReactNode } from 'react';
import { Button, Empty, Tooltip } from 'antd';
import styles from './DayViewCalendar.module.css';
import { Link } from 'react-router-dom';
import CalendarTooltip from './CalendarTooltip.tsx';
import { useQuery } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';

type DayViewCalendarProps = {
  events: Event[];
  date: Date;
  dateParam: string;
  onClickEvent: (event: Event) => void;
};

type EventGridPosition = {
  event: Event;
  gridRow: number;
  gridRowSpan: number;
  gridColumn: number;
};

const DayViewCalendar = ({
  events,
  date,
  dateParam,
  onClickEvent
}: DayViewCalendarProps) => {
  const {
    eventCategoriesApi: { getAll: getAllEventCategories }
  } = useApi();
  const { data } = useQuery({
    queryFn: getAllEventCategories,
    queryKey: buildQueryKey('eventCategories')
  });

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
    const emptyColumn: boolean[] = [];

    for (let i = startingHour; i <= endingHour; i++) {
      hours.push(i);
      emptyColumn.push(false);
      emptyColumn.push(false);
      emptyColumn.push(false);
      emptyColumn.push(false);
    }

    const usedPositions: boolean[][] = [[...emptyColumn]];
    const eventPositions: EventGridPosition[] = [];

    events.forEach((event) => {
      const startEvent = new Date(event.start);
      const endEvent = new Date(event.end);
      const gridRow =
        (startEvent.getHours() - startingHour) * 4 +
        1 +
        startEvent.getMinutes() / 15;
      const gridRowSpan =
        (endEvent.valueOf() - startEvent.valueOf()) / 1000 / 60 / 15;

      let gridColumn: number | undefined = undefined;

      for (let i = 0; i < usedPositions.length; i++) {
        let canUse = true;
        for (
          let rowIndex = gridRow;
          rowIndex < gridRow + gridRowSpan;
          rowIndex++
        ) {
          if (usedPositions[i][rowIndex]) {
            canUse = false;
            break;
          }
        }

        if (canUse) {
          gridColumn = i;

          // Consume grid positions
          for (
            let rowIndex = gridRow;
            rowIndex < gridRow + gridRowSpan;
            rowIndex++
          ) {
            usedPositions[i][rowIndex] = true;
          }

          break;
        }
      }

      if (gridColumn === undefined) {
        usedPositions.push([...emptyColumn]);

        // Consume grid positions
        for (
          let rowIndex = gridRow;
          rowIndex < gridRow + gridRowSpan;
          rowIndex++
        ) {
          usedPositions[usedPositions.length - 1][rowIndex] = true;
        }

        gridColumn = usedPositions.length - 1;
      }

      const newPosition: EventGridPosition = {
        event,
        gridRow,
        gridRowSpan,
        gridColumn: gridColumn + 2
      };

      eventPositions.push(newPosition);
    });

    const maxColumn = eventPositions.reduce(
      (prev, current) =>
        prev >= current.gridColumn ? prev : current.gridColumn,
      1
    );

    content = (
      <div
        className={styles.dayViewContainer}
        style={{
          gridTemplateColumns: `100px repeat(${maxColumn - 1}, 1fr)`,
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
        {eventPositions.map(({ event, gridRow, gridRowSpan, gridColumn }) => {
          const eventCategory = data?.data?.find(
            (x) => x._id === event.category
          );
          const backgroundColor = eventCategory
            ? eventCategory.backgroundColor
            : undefined;
          const fontColor = eventCategory ? eventCategory.fontColor : undefined;

          return (
            <Tooltip key={event._id} title={<CalendarTooltip event={event} />}>
              <div
                onClick={() => onClickEvent(event)}
                className={styles.eventItem}
                style={{
                  gridRow: `${gridRow} / span ${gridRowSpan}`,
                  gridColumn: gridColumn,
                  backgroundColor,
                  color: fontColor
                }}
              >
                {event.name}
              </div>
            </Tooltip>
          );
        })}
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
