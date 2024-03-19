import EventCategoryForm from './EventCategoryForm.tsx';
import { EditBaseApiEntityPage } from '../base-data-table-page';

const EditEventCategoryPage = () => {
  return (
    <EditBaseApiEntityPage
      queryKey="eventCategories"
      baseApiType="eventCategoriesApi"
      editForm={EventCategoryForm}
      mainPage="/events/categories"
    />
  );
};

export default EditEventCategoryPage;
