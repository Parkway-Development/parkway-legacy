import ContributionForm from './ContributionForm.tsx';
import { AddBaseApiEntityPage } from '../base-data-table-page';

const AddContributionPage = () => {
  return (
    <AddBaseApiEntityPage
      queryKey="contributions"
      baseApiType="contributionsApi"
      addForm={ContributionForm}
      mainPage="/accounts/contributions"
    />
  );
};

export default AddContributionPage;
