import useAxios from '../../hooks/useAxios.ts';
import { Alert, Empty, Spin, Table } from 'antd';
import { DirectoryUser } from '../../types/DirectoryUser.ts';
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
    dataIndex: 'firstname',
    key: 'firstname'
  },
  {
    title: 'Last Name',
    dataIndex: 'lastname',
    key: 'lastname'
  },
  {
    title: 'Mobile',
    dataIndex: 'mobile',
    key: 'mobile'
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
      <p>Total Records {data.length}</p>
      <Table dataSource={data} columns={directoryListColumns} />
    </div>
  );
};

export default DirectoryPage;
