import {
  applicationRoleMapping,
  genderMapping,
  statusMapping,
  UserProfile
} from '../../types/UserProfile.ts';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import BaseDataTablePage from '../base-data-table-page/BaseDataTablePage.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircleOutlined } from '@ant-design/icons';
import { translateMapping } from '../../utilities/mappingHelpers.ts';
import useColumns, { OrderedColumnsType } from '../../hooks/useColumns.tsx';

const userProfileColumns: OrderedColumnsType<UserProfile> = [
  {
    title: 'First Name',
    dataIndex: 'firstname',
    key: 'firstname',
    displayOrder: 1
  },
  {
    title: 'Last Name',
    dataIndex: 'lastname',
    key: 'lastname',
    displayOrder: 2
  },
  {
    title: 'Middle Initial',
    dataIndex: 'middleinitial',
    key: 'middleinitial',
    displayOrder: 3
  },
  {
    title: 'Nickname',
    dataIndex: 'nickname',
    key: 'nickname',
    displayOrder: 4
  },
  {
    title: 'Date of Birth',
    dataIndex: 'dateofbirth',
    render: (value: UserProfile['dateofbirth']) => {
      if (!value) return undefined;
      return new Date(value).toLocaleDateString();
    },
    key: 'dateofbirth',
    displayOrder: 5
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    render: (value: UserProfile['gender']) =>
      translateMapping(genderMapping, value),
    key: 'gender',
    displayOrder: 6
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    displayOrder: 7
  },
  {
    title: 'Mobile',
    dataIndex: 'mobile',
    key: 'mobile',
    displayOrder: 8
  },
  {
    title: 'Street Address 1',
    dataIndex: 'streetaddress1',
    key: 'streetaddress1',
    displayOrder: 9
  },
  {
    title: 'Street Address 2',
    dataIndex: 'streetaddress2',
    key: 'streetaddress2',
    displayOrder: 10
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    displayOrder: 11
  },
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
    displayOrder: 12
  },
  {
    title: 'Zip',
    dataIndex: 'zip',
    key: 'zip',
    displayOrder: 13
  },
  {
    title: 'User Id',
    dataIndex: 'userId',
    key: 'userId',
    displayOrder: 14
  },
  {
    title: 'Member?',
    dataIndex: 'member',
    render: (value: UserProfile['member']) =>
      value ? <CheckCircleOutlined /> : undefined,
    align: 'center',
    key: 'member',
    displayOrder: 15
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value: UserProfile['status']) =>
      translateMapping(statusMapping, value),
    key: 'status',
    displayOrder: 16
  },
  {
    title: 'App Role',
    dataIndex: 'applicationrole',
    render: (value: UserProfile['applicationrole']) =>
      translateMapping(applicationRoleMapping, value),
    key: 'applicationrole',
    displayOrder: 17
  },
  {
    title: 'Teams',
    dataIndex: 'teams',
    render: (value: UserProfile['teams']) => value?.length ?? 0,
    align: 'center',
    key: 'teams',
    displayOrder: 18
  },
  {
    title: 'Family',
    dataIndex: 'family',
    key: 'family',
    displayOrder: 19
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
    columnType: 'directoryPage',
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
