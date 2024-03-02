import { UserProfile } from '../../types/UserProfile.ts';
import { ColumnsType } from 'antd/lib/table';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import BaseDataTablePage from '../base-data-table-page/BaseDataTablePage.tsx';

const DirectoryPage = () => {
  const { getProfiles } = useApi();

  const columns: ColumnsType<UserProfile> = [
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

  return (
    <BaseDataTablePage
      queryFn={getProfiles}
      queryKey={buildQueryKey('profiles')}
      columns={columns}
      title="Directory"
      addLink="/profiles/add"
      addLinkTitle="Add Profile"
    />
  );
};

export default DirectoryPage;
