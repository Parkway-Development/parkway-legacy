import TeamForm from './TeamForm.tsx';
import { AddBaseApiEntityPage } from '../base-data-table-page';

const AddTeamPage = () => {
  return (
    <AddBaseApiEntityPage
      queryKey="teams"
      baseApiType="teamsApi"
      addForm={TeamForm}
      mainPage="/teams"
    />
  );
};

export default AddTeamPage;
