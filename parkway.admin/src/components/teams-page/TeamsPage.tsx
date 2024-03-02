import { Team } from '../../types/Team.ts';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQueryClient } from '@tanstack/react-query';
import UserDisplayById from '../user-display/UserDisplayById.tsx';
import BaseDataTablePage from '../base-data-table-page/BaseDataTablePage.tsx';
import useColumns, { OrderedColumnsType } from '../../hooks/useColumns.tsx';

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
    dataIndex: 'leaderId',
    render: (value: Team['leaderId']) => <UserDisplayById id={value} />,
    key: 'leaderId',
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

const TeamsPage = () => {
  const queryClient = useQueryClient();
  const { deleteTeam, getTeams } = useApi();

  const handleDelete = () => {
    queryClient.invalidateQueries({
      queryKey: buildQueryKey('teams')
    });
  };

  const { columns } = useColumns({
    columns: teamColumns,
    deleteAction: { deleteFn: deleteTeam, handleDelete },
    editLink: ({ _id }) => `/teams/${_id}/edit`
  });

  return (
    <BaseDataTablePage
      addLink="/teams/add"
      queryFn={getTeams}
      queryKey={buildQueryKey('teams')}
      columns={columns}
      title="Teams"
    />
  );
};

export default TeamsPage;
