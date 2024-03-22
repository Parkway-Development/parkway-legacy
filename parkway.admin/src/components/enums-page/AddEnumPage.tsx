import EnumForm from './EnumForm.tsx';
import { AddBaseApiEntityPage } from '../base-data-table-page';

const AddEnumPage = () => {
  return (
    <AddBaseApiEntityPage
      queryKey="enums"
      baseApiType="enumsApi"
      addForm={EnumForm}
      mainPage="/platform/enums"
    />
  );
};

export default AddEnumPage;
