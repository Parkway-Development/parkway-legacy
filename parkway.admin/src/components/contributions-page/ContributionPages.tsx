import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import ContributionDisplay from './ContributionDisplay.tsx';
import ContributionForm from './ContributionForm.tsx';
import DateDisplay from '../date-display';
import { UserNameDisplayById } from '../user-name-display';
import { contributionColumns } from './ContributionsPage.tsx';

const sharedProps: SharedBasePageProps = {
  queryKey: 'contributions',
  baseApiType: 'contributionsApi',
  mainPage: '/accounts/contributions'
};

const ContributionsPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={contributionColumns}
    title="Contributions"
    responsiveCardRenderer={(contribution) => (
      <>
        <DateDisplay date={contribution.transactionDate} />
        <UserNameDisplayById id={contribution.profile} />
      </>
    )}
  />
);

const ContributionPage = () => (
  <BaseDisplayPage {...sharedProps} render={ContributionDisplay} />
);

const AddContributionPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={ContributionForm} />
);

const EditContributionPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={ContributionForm} />
);

export {
  AddContributionPage,
  EditContributionPage,
  ContributionsPage,
  ContributionPage
};
