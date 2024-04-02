import { EventCategory } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import EventCategoryDisplay from './EventCategoryDisplay.tsx';

export const eventCategoryColumns: OrderedColumnsType<EventCategory> = [
  {
    title: 'Category',
    dataIndex: 'name',
    key: 'name',
    render: (_, eventCategory) => <EventCategoryDisplay {...eventCategory} />,
    displayOrder: 1
  }
];
