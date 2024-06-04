import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import EventCategoryDisplay from '../event-category-display';
import EventCategoryForm from './EventCategoryForm.tsx';
import { eventCategoryColumns } from './columns.tsx';
import { EventCategory } from '../../types';

const sharedProps: SharedBasePageProps = {
  queryKey: 'eventCategories',
  baseApiType: 'eventCategoriesApi',
  mainPage: '/events/categories'
};

const EventCategoriesPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={eventCategoryColumns}
    title="Event Categories"
    addLinkTitle="Add Event Category"
    responsiveCardRenderer={(item) => item.name}
  />
);

const EventCategoryPage = () => (
  <BaseDisplayPage
    {...sharedProps}
    render={(item: EventCategory) => (
      <EventCategoryDisplay eventCategory={item} />
    )}
  />
);

const AddEventCategoryPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={EventCategoryForm} />
);

const EditEventCategoryPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={EventCategoryForm} />
);

export {
  AddEventCategoryPage,
  EditEventCategoryPage,
  EventCategoriesPage,
  EventCategoryPage
};
