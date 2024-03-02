import { UserProfile } from '../../types/UserProfile.ts';
import { ColumnsType } from 'antd/lib/table';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import BaseDataTablePage, {
  buildActionsColumn
} from '../base-data-table-page/BaseDataTablePage.tsx';
import { useQueryClient } from '@tanstack/react-query';

const DirectoryPage = () => {
  const queryClient = useQueryClient();
  const { deleteUserProfile, getUserProfiles } = useApi();

  const handleDelete = () => {
    queryClient.invalidateQueries({
      queryKey: buildQueryKey('profiles')
    });
  };

  const columns: ColumnsType<UserProfile> = [
    buildActionsColumn({
      deleteAction: { deleteFn: deleteUserProfile, handleDelete },
      editLink: ({ _id }) => `/profiles/${_id}/edit`
    }),
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
      queryFn={getUserProfiles}
      queryKey={buildQueryKey('profiles')}
      columns={columns}
      title="Directory"
      addLink="/profiles/add"
      addLinkTitle="Add Profile"
    />
  );
};

export default DirectoryPage;
