import { Team } from '../../types';
import { UserNameDisplayById } from '../user-name-display';
import { BaseApiDataTablePage } from '../base-data-table-page';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';

const teamColumns: OrderedColumnsType<Team> = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 200,
    key: 'name',
    displayOrder: 1
  },
  {
    title: 'Leader',
    width: 200,
    dataIndex: 'leader',
    render: (value: Team['leader']) => <UserNameDisplayById id={value} />,
    key: 'leader',
    displayOrder: 2
  },
  {
    title: 'Members',
    width: 50,
    dataIndex: 'members',
    align: 'center',
    render: (value: Team['members']) => value.length,
    key: 'members',
    displayOrder: 3
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    displayOrder: 4
  }
];

const TeamsPage = () => (
  <BaseApiDataTablePage
    queryKey="teams"
    baseApiType="teamsApi"
    columns={teamColumns}
    title="Teams"
  />
);

export default TeamsPage;
