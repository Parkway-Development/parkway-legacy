import { ColumnsType } from 'antd/lib/table';
import { Team } from '../../types/Team.ts';
import { Link } from 'react-router-dom';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQueryClient } from '@tanstack/react-query';
import UserDisplayById from '../user-display/UserDisplayById.tsx';
import BaseDataTablePage, {
  buildDeleteColumn
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
    {
      title: 'Name',
      width: 100,
      render: ({ _id, name }: Team) => (
        <Link to={`/teams/${_id}/edit`}>{name}</Link>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 250
    },
    {
      title: 'Leader',
      width: 100,
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
    buildDeleteColumn(deleteTeam, handleDelete)
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
