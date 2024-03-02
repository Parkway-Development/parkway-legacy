import {
  applicationRoleMapping,
  genderMapping,
  statusMapping,
  UserProfile
} from '../../types/UserProfile.ts';
import { ColumnsType } from 'antd/lib/table';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import BaseDataTablePage from '../base-data-table-page/BaseDataTablePage.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircleOutlined } from '@ant-design/icons';
import { translateMapping } from '../../utilities/mappingHelpers.ts';
import useColumns from '../../hooks/useColumns.tsx';

const userProfileColumns: ColumnsType<UserProfile> = [
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
    title: 'Middle Initial',
    dataIndex: 'middleinitial',
    key: 'middleinitial'
  },
  {
    title: 'Nickname',
    dataIndex: 'nickname',
    key: 'nickname'
  },
  {
    title: 'Date of Birth',
    dataIndex: 'dateofbirth',
    render: (value: UserProfile['dateofbirth']) => {
      if (!value) return undefined;
      return new Date(value).toLocaleDateString();
    },
    key: 'dateofbirth'
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    render: (value: UserProfile['gender']) =>
      translateMapping(genderMapping, value),
    key: 'gender'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Mobile',
    dataIndex: 'mobile',
    key: 'mobile'
  },
  {
    title: 'Street Address 1',
    dataIndex: 'streetaddress1',
    key: 'streetaddress1'
  },
  {
    title: 'Street Address 2',
    dataIndex: 'streetaddress2',
    key: 'streetaddress2'
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city'
  },
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state'
  },
  {
    title: 'Zip',
    dataIndex: 'zip',
    key: 'zip'
  },
  {
    title: 'User Id',
    dataIndex: 'userId',
    key: 'userId'
  },
  {
    title: 'Member?',
    dataIndex: 'member',
    render: (value: UserProfile['member']) =>
      value ? <CheckCircleOutlined /> : undefined,
    align: 'center',
    key: 'member'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value: UserProfile['status']) =>
      translateMapping(statusMapping, value),
    key: 'status'
  },
  {
    title: 'App Role',
    dataIndex: 'applicationrole',
    render: (value: UserProfile['applicationrole']) =>
      translateMapping(applicationRoleMapping, value),
    key: 'applicationrole'
  },
  {
    title: 'Teams',
    dataIndex: 'teams',
    render: (value: UserProfile['teams']) => value?.length ?? 0,
    align: 'center',
    key: 'teams'
  },
  {
    title: 'Family',
    dataIndex: 'family',
    key: 'family'
  }
];

const DirectoryPage = () => {
  const queryClient = useQueryClient();
  const { deleteUserProfile, getUserProfiles } = useApi();

  const handleDelete = () => {
    queryClient.invalidateQueries({
      queryKey: buildQueryKey('profiles')
    });
  };

  const { columns } = useColumns({
    columns: userProfileColumns,
    deleteAction: { deleteFn: deleteUserProfile, handleDelete },
    editLink: ({ _id }) => `/profiles/${_id}/edit`
  });

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
