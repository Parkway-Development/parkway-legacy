import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import { Team } from '../../types';
import { teamColumns } from './columns.tsx';
import TeamForm from './TeamForm.tsx';
import TeamDisplay from './TeamDisplay.tsx';

const sharedProps: SharedBasePageProps = {
  queryKey: 'teams',
  baseApiType: 'teamsApi',
  mainPage: '/teams'
};

const TeamsPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={teamColumns}
    title="Teams"
    responsiveCardRenderer={(item) => item.name}
  />
);

const TeamPage = () => (
  <BaseDisplayPage
    {...sharedProps}
    render={(item: Team) => <TeamDisplay {...item} />}
  />
);

const AddTeamPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={TeamForm} />
);

const EditTeamPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={TeamForm} />
);

export { AddTeamPage, EditTeamPage, TeamsPage, TeamPage };
