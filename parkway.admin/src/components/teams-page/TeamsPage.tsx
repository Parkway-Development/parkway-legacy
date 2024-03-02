import { ColumnsType } from 'antd/lib/table';
import { Team } from '../../types/Team.ts';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQueryClient } from '@tanstack/react-query';
import UserDisplayById from '../user-display/UserDisplayById.tsx';
import BaseDataTablePage, {
  buildActionsColumn
} from '../base-data-table-page/BaseDataTablePage.tsx';

const TeamsPage = () => {
  const queryClient = useQueryClient();
  const { deleteTeam, getTeams } = useApi();

  const handleDelete = () => {
    queryClient.invalidateQueries({
      queryKey: buildQueryKey('teams')
    });
  };

  const teamColumns: ColumnsType<Team> = [
    buildActionsColumn({
      deleteAction: { deleteFn: deleteTeam, handleDelete },
      editLink: ({ _id }) => `/teams/${_id}/edit`
    }),
    {
      title: 'Name',
      dataIndex: 'name',
      width: 200
    },
    {
      title: 'Leader',
      width: 200,
      dataIndex: 'leaderId',
      render: (value: Team['leaderId']) => <UserDisplayById id={value} />
    },
    {
      title: 'Members',
      width: 50,
      dataIndex: 'members',
      align: 'center',
      render: (value: Team['members']) => value.length
    },
    {
      title: 'Description',
      dataIndex: 'description'
    }
  ];

  return (
    <BaseDataTablePage
      addLink="/teams/add"
      queryFn={getTeams}
      queryKey={buildQueryKey('teams')}
      columns={teamColumns}
      title="Teams"
    />
  );
};

export default TeamsPage;
