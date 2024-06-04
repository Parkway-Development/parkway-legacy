import styles from './EventCategoryDisplay.module.css';
import { EventCategory } from '../../types';
import { EventCategoryDisplayById } from './EventCategoryDisplayById.tsx';

export type EventCategoryDisplayProps = {
  eventCategory?:
    | Pick<EventCategory, 'backgroundColor' | 'fontColor' | 'name'>
    | string;
  isSmall?: boolean;
};

const EventCategoryDisplay = ({
  eventCategory,
  isSmall = false
}: EventCategoryDisplayProps) => {
  if (!eventCategory) return null;

  if (typeof eventCategory === 'string')
    return <EventCategoryDisplayById id={eventCategory} isSmall={isSmall} />;

  let classNames = styles.container;

  if (isSmall) {
    classNames += ` ${styles.isSmall}`;
  }

  const { backgroundColor, fontColor, name } = eventCategory;

  return (
    <div
      className={classNames}
      style={{
        backgroundColor: backgroundColor,
        color: fontColor
      }}
    >
      {name?.length ? name : 'Sample Event Name Display'}
    </div>
  );
};

export default EventCategoryDisplay;
