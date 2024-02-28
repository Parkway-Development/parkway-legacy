import { useGet } from '../../hooks/useAxios';
import { Alert, Button, Empty, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import styles from './TeamsPage.module.css';
import { Team } from '../../types/Team.ts';
import { Link } from 'react-router-dom';

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

const directoryListColumns: ColumnsType<Team> = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Description',
    dataIndex: 'description'
  }
];

const TeamsList = () => {
  const { loading, error, data } = useGet<Team[]>('/api/team');

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (loading) {
    return <Spin />;
  }

  if (!data?.length) {
    return <Empty />;
  }

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
