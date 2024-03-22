import EnumForm from './EnumForm.tsx';
import { EditBaseApiEntityPage } from '../base-data-table-page';

const EditEnumPage = () => {
  return (
    <EditBaseApiEntityPage
      queryKey="enums"
      baseApiType="enumsApi"
      editForm={EnumForm}
      mainPage="/platform/enums"
    />
  );
};

export default EditEnumPage;
