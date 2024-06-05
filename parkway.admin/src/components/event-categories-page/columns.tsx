import { EventCategory } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import EventCategoryDisplay from '../event-category-display';

export const eventCategoryColumns: OrderedColumnsType<EventCategory> = [
  {
    title: 'Category',
    dataIndex: 'name',
    key: 'name',
    render: (_, eventCategory) => (
      <EventCategoryDisplay eventCategory={eventCategory} />
    ),
    displayOrder: 1
  }
];
