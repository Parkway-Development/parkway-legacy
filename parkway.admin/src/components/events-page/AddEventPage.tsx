import EventForm from './EventForm.tsx';
import { AddBaseApiEntityPage } from '../base-data-table-page';

const AddEventPage = () => {
  return (
    <AddBaseApiEntityPage
      queryKey="events"
      baseApiType="eventsApi"
      addForm={EventForm}
      mainPage="/events"
    />
  );
};

export default AddEventPage;
