import TeamForm from './TeamForm.tsx';
import { EditBaseApiEntityPage } from '../base-data-table-page';

const EditTeamPage = () => {
  return (
    <EditBaseApiEntityPage
      queryKey="teams"
      baseApiType="teamsApi"
      editForm={TeamForm}
      mainPage="/teams"
    />
  );
};

export default EditTeamPage;
