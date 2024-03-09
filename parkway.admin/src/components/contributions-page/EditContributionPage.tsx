import ContributionForm from './ContributionForm.tsx';
import { EditBaseApiEntityPage } from '../base-data-table-page';

const EditContributionPage = () => {
  return (
    <EditBaseApiEntityPage
      queryKey="contributions"
      baseApiType="contributionsApi"
      editForm={ContributionForm}
      mainPage="/accounts/contributions"
    />
  );
};

export default EditContributionPage;
