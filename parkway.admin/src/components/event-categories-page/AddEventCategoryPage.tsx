import EventCategoryForm from './EventCategoryForm.tsx';
import { AddBaseApiEntityPage } from '../base-data-table-page';

const AddEventCategoryPage = () => {
  return (
    <AddBaseApiEntityPage
      queryKey="eventCategories"
      baseApiType="eventCategoriesApi"
      addForm={EventCategoryForm}
      mainPage="/events/categories"
    />
  );
};

export default AddEventCategoryPage;
