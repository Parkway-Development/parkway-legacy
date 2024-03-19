import { EventCategory } from '../../types';
import { BaseApiDataTablePage } from '../base-data-table-page';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import EventCategoryDisplay from './EventCategoryDisplay.tsx';

const eventCategoryColumns: OrderedColumnsType<EventCategory> = [
  {
    title: 'Category',
    dataIndex: 'name',
    key: 'name',
    render: (_, eventCategory) => <EventCategoryDisplay {...eventCategory} />,
    displayOrder: 1
  }
];

const EventCategoriesPage = () => (
  <BaseApiDataTablePage
    queryKey="eventCategories"
    baseApiType="eventCategoriesApi"
    columns={eventCategoryColumns}
    title="Event Categories"
  />
);

export default EventCategoriesPage;
