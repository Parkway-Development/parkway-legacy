import {
  applicationRoleMapping,
  genderMapping,
  statusMapping,
  UserProfile
} from '../../types/UserProfile.ts';
import { ColumnsType } from 'antd/lib/table';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import BaseDataTablePage, {
  buildActionsColumn
} from '../base-data-table-page/BaseDataTablePage.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircleOutlined } from '@ant-design/icons';
import { translateMapping } from '../../utilities/mappingHelpers.ts';

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
      title: 'Middle Initial',
      dataIndex: 'middleinitial'
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname'
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateofbirth',
      render: (value: UserProfile['dateofbirth']) => {
        if (!value) return undefined;
        return new Date(value).toLocaleDateString();
      }
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      render: (value: UserProfile['gender']) =>
        translateMapping(genderMapping, value)
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile'
    },
    {
      title: 'Street Address 1',
      dataIndex: 'streetaddress1'
    },
    {
      title: 'Street Address 2',
      dataIndex: 'streetaddress2'
    },
    {
      title: 'City',
      dataIndex: 'city'
    },
    {
      title: 'State',
      dataIndex: 'state'
    },
    {
      title: 'Zip',
      dataIndex: 'zip'
    },
    {
      title: 'User Id',
      dataIndex: 'userId'
    },
    {
      title: 'Member?',
      dataIndex: 'member',
      render: (value: UserProfile['member']) =>
        value ? <CheckCircleOutlined /> : undefined,
      align: 'center'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: UserProfile['status']) =>
        translateMapping(statusMapping, value)
    },
    {
      title: 'App Role',
      dataIndex: 'applicationrole',
      render: (value: UserProfile['applicationrole']) =>
        translateMapping(applicationRoleMapping, value)
    },
    {
      title: 'Teams',
      dataIndex: 'teams',
      render: (value: UserProfile['teams']) => value?.length ?? 0,
      align: 'center'
    },
    {
      title: 'Family',
      dataIndex: 'family'
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
