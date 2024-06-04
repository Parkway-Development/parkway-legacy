import {
  AddBaseApiEntityPage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import EventForm from './EventForm.tsx';
import EventDisplay from './EventDisplay.tsx';

const sharedProps: SharedBasePageProps = {
  queryKey: 'events',
  baseApiType: 'eventsApi',
  mainPage: '/events'
};

const EventPage = () => (
  <BaseDisplayPage {...sharedProps} render={EventDisplay} />
);

const AddEventPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={EventForm} />
);

const EditEventPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={EventForm} />
);

export { AddEventPage, EditEventPage, EventPage };
