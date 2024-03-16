import EventForm from './EventForm.tsx';
import { EditBaseApiEntityPage } from '../base-data-table-page';

const EditEventPage = () => {
  return (
    <EditBaseApiEntityPage
      queryKey="events"
      baseApiType="eventsApi"
      editForm={EventForm}
      mainPage="/events"
    />
  );
};

export default EditEventPage;
