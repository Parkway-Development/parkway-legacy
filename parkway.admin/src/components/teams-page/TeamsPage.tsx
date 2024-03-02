import { ColumnsType } from 'antd/lib/table';
import { Team } from '../../types/Team.ts';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQueryClient } from '@tanstack/react-query';
import UserDisplayById from '../user-display/UserDisplayById.tsx';
import BaseDataTablePage from '../base-data-table-page/BaseDataTablePage.tsx';
import useColumns from '../../hooks/useColumns.tsx';

const teamColumns: ColumnsType<Team> = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 200,
    key: 'name'
  },
  {
    title: 'Leader',
    width: 200,
    dataIndex: 'leaderId',
    render: (value: Team['leaderId']) => <UserDisplayById id={value} />,
    key: 'leaderId'
  },
  {
    title: 'Members',
    width: 50,
    dataIndex: 'members',
    align: 'center',
    render: (value: Team['members']) => value.length,
    key: 'members'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
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
