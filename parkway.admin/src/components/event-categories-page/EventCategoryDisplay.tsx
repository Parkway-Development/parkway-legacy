import styles from './EventCategoryDisplay.module.css';
import { EventCategory } from '../../types';

export type EventCategoryDisplayProps = Pick<
  EventCategory,
  'backgroundColor' | 'fontColor' | 'name'
> & {
  isSmall?: boolean;
};

const EventCategoryDisplay = ({
  backgroundColor,
  fontColor,
  name,
  isSmall = false
}: EventCategoryDisplayProps) => {
  let classNames = styles.container;

  if (isSmall) {
    classNames += ` ${styles.isSmall}`;
  }

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
