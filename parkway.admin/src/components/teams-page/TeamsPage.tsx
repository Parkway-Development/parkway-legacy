import { useGet } from '../../hooks/useAxios';
import { Alert, Button, Empty, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import styles from './TeamsPage.module.css';
import { Team } from '../../types/Team.ts';
import { Link } from 'react-router-dom';
import DeleteButton from '../delete-button/DeleteButton.tsx';
import useApi from '../../hooks/useApi.ts';

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

const TeamsList = () => {
  const { deleteTeam } = useApi();
  const { loading, error, data, setData } = useGet<Team[]>('/api/team');

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (loading) {
    return <Spin />;
  }

  if (!data?.length) {
    return <Empty />;
  }

  const handleDelete = (team: Team) => {
    setData((prev) => prev?.filter((x) => x !== team));
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
          onSuccess={() => handleDelete(value)}
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
