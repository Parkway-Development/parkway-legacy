import { UserProfile } from '../../types/UserProfile.ts';
import { ColumnsType } from 'antd/lib/table';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import BaseDataTablePage, {
  buildDeleteColumn
} from '../base-data-table-page/BaseDataTablePage.tsx';
import { useQueryClient } from '@tanstack/react-query';

const DirectoryPage = () => {
  const queryClient = useQueryClient();
  const { deleteUserProfile, getProfiles } = useApi();

  const handleDelete = () => {
    queryClient.invalidateQueries({
      queryKey: buildQueryKey('profiles')
    });
  };

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
    },
    buildDeleteColumn(deleteUserProfile, handleDelete)
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
