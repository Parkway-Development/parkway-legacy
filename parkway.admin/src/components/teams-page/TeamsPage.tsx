import { Alert, Button, Empty, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import styles from './TeamsPage.module.css';
import { Team } from '../../types/Team.ts';
import { Link } from 'react-router-dom';
import DeleteButton from '../delete-button/DeleteButton.tsx';
import useApi from '../../hooks/useApi.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const TeamsPage = () => {
  return (
    <>
      <h2>Teams</h2>
      <nav className={styles.nav}>
        <Link to="/teams/add">
          <Button type="primary">Add Team</Button>
        </Link>
      </nav>
      <TeamsList />
    </>
  );
};

const TeamsQueryKey = 'teams';

const TeamsList = () => {
  const queryClient = useQueryClient();
  const { deleteTeam, formatError, getTeams } = useApi();
  const {
    isPending,
    error,
    data: response
  } = useQuery({
    queryFn: getTeams,
    queryKey: [TeamsQueryKey]
  });

  if (error) {
    return <Alert type="error" message={formatError(error)} />;
  }

  if (isPending) {
    return <Spin />;
  }

  if (!response?.data?.length) {
    return <Empty />;
  }

  const { data } = response;

  const handleDelete = () => {
    queryClient.invalidateQueries({
      queryKey: [TeamsQueryKey]
    });
  };

  const directoryListColumns: ColumnsType<Team> = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Description',
      dataIndex: 'description'
    },
    {
      title: 'Delete',
      render: (value) => (
        <DeleteButton
          id={value._id}
          deleteFn={deleteTeam}
          onSuccess={handleDelete}
        />
      ),
      width: 50,
      align: 'center'
    }
  ];

  return (
    <div className={styles.dataContainer}>
      <p>Total Count: {data.length}</p>
      <Table
        dataSource={data}
        columns={directoryListColumns}
        rowKey={(record) => record._id}
        size="small"
        bordered
      />
    </div>
  );
};

export default TeamsPage;
