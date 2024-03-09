import {
  applicationRoleMapping,
  genderMapping,
  memberStatusMapping,
  UserProfile
} from '../../types/UserProfile.ts';
import { BaseApiDataTablePage } from '../base-data-table-page';
import { CheckCircleOutlined } from '@ant-design/icons';
import { translateMapping } from '../../utilities';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import DateDisplay from '../date-display/DateDisplay.tsx';

const userProfileColumns: OrderedColumnsType<UserProfile> = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
    displayOrder: 1
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
    displayOrder: 2
  },
  {
    title: 'Middle Initial',
    dataIndex: 'middleInitial',
    key: 'middleInitial',
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
    dataIndex: 'dateOfBirth',
    render: (value: UserProfile['dateOfBirth']) => <DateDisplay date={value} />,
    key: 'dateOfBirth',
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
    title: 'Mobile Phone',
    dataIndex: 'mobilePhone',
    key: 'mobilePhone',
    displayOrder: 8
  },
  {
    title: 'Home Phone',
    dataIndex: 'homePhone',
    key: 'homePhone',
    displayOrder: 9
  },
  {
    title: 'Street Address 1',
    dataIndex: 'streetAddress1',
    key: 'streetAddress1',
    displayOrder: 10
  },
  {
    title: 'Street Address 2',
    dataIndex: 'streetAddress2',
    key: 'streetAddress2',
    displayOrder: 11
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    displayOrder: 12
  },
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
    displayOrder: 13
  },
  {
    title: 'Zip',
    dataIndex: 'zip',
    key: 'zip',
    displayOrder: 14
  },
  {
    title: 'User Linked',
    dataIndex: 'user',
    key: 'user',
    render: (value: UserProfile['user']) =>
      value ? <CheckCircleOutlined /> : undefined,
    displayOrder: 15,
    align: 'center'
  },
  {
    title: 'Member?',
    dataIndex: 'member',
    render: (value: UserProfile['member']) =>
      value ? <CheckCircleOutlined /> : undefined,
    align: 'center',
    key: 'member',
    displayOrder: 16
  },
  {
    title: 'Member Status',
    dataIndex: 'memberStatus',
    render: (value: UserProfile['memberStatus']) =>
      translateMapping(memberStatusMapping, value),
    key: 'memberStatus',
    displayOrder: 17
  },
  {
    title: 'App Role',
    dataIndex: 'applicationRole',
    render: (value: UserProfile['applicationRole']) =>
      translateMapping(applicationRoleMapping, value),
    key: 'applicationRole',
    displayOrder: 18
  },
  {
    title: 'Teams',
    dataIndex: 'teams',
    render: (value: UserProfile['teams']) => value?.length ?? 0,
    align: 'center',
    key: 'teams',
    displayOrder: 19
  },
  {
    title: 'Family',
    dataIndex: 'family',
    key: 'family',
    displayOrder: 20
  }
];

const DirectoryPage = () => (
  <BaseApiDataTablePage
    queryKey="profiles"
    baseApiType="usersApi"
    columns={userProfileColumns}
    title="Directory"
    addLinkTitle="Add User Profile"
  />
);

export default DirectoryPage;
