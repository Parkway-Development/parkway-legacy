import AccountForm from './AccountForm.tsx';
import { AddBaseApiEntityPage } from '../base-data-table-page';

const AddAccountPage = () => {
  return (
    <AddBaseApiEntityPage
      queryKey="accounts"
      baseApiType="accountsApi"
      addForm={AccountForm}
      mainPage="/accounts"
    />
  );
};

export default AddAccountPage;
