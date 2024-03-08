import AccountForm from './AccountForm.tsx';
import { EditBaseApiEntityPage } from '../base-data-table-page';

const EditAccountPage = () => {
  return (
    <EditBaseApiEntityPage
      queryKey="accounts"
      baseApiType="accountsApi"
      editForm={AccountForm}
      mainPage="/accounts"
    />
  );
};

export default EditAccountPage;
