import { Alert, Empty, Spin, Table } from 'antd';
import { UserProfile } from '../../types/UserProfile.ts';
import { ColumnsType } from 'antd/lib/table';
import styles from './DirectoryPage.module.css';
import { useQuery } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';

const DirectoryPage = () => {
  return (
    <>
      <h2>Directory</h2>
      <DirectoryList />
    </>
  );
};

const directoryListColumns: ColumnsType<UserProfile> = [
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
  const { getProfiles, formatError } = useApi();
  const {
    isPending,
    error,
    data: response
  } = useQuery({ queryFn: getProfiles, queryKey: buildQueryKey('profiles') });

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

export default DirectoryPage;
