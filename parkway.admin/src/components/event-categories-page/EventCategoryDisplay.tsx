import styles from './EventCategoryDisplay.module.css';
import { EventCategory } from '../../types';

type EventCategoryDisplayProps = Pick<
  EventCategory,
  'backgroundColor' | 'fontColor' | 'name'
>;

const EventCategoryDisplay = ({
  backgroundColor,
  fontColor,
  name
}: EventCategoryDisplayProps) => {
  return (
    <div
      className={styles.container}
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
