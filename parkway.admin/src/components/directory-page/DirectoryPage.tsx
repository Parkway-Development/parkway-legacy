import useAxios from '../../hooks/useAxios';
import { Alert, Empty, Spin, Table } from 'antd';
import { DirectoryUser } from '../../types/DirectoryUser';
import { ColumnsType } from 'antd/lib/table';
import styles from './DirectoryPage.module.css';

const DirectoryPage = () => {
  return (
    <>
      <h2>Directory</h2>
      <DirectoryList />
    </>
  );
};

const directoryListColumns: ColumnsType<DirectoryUser> = [
  {
    title: 'First Name',
    dataIndex: 'firstname'
  },
  {
    title: 'Last Name',
    dataIndex: 'lastname'
  },
  {
    title: 'Mobile',
    dataIndex: 'mobile'
  }
];

const DirectoryList = () => {
  const { loading, error, data } =
    useAxios<DirectoryUser[]>('/api/people/getall');

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
        rowKey={(record) => record.id}
      />
    </div>
  );
};

export default DirectoryPage;
