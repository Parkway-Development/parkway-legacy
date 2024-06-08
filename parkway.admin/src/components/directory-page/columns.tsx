import { Address, genderMapping, UserProfile } from '../../types';
import { CheckCircleOutlined } from '@ant-design/icons';
import { translateMapping } from '../../utilities';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import DateDisplay from '../date-display';
import EmailDisplay from '../email-display';

export const directoryColumns: OrderedColumnsType<UserProfile> = [
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
    displayOrder: 7,
    render: (value: UserProfile['email']) => <EmailDisplay email={value} />
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
    dataIndex: 'address',
    key: 'streetAddress1',
    displayOrder: 10,
    render: (value?: Address) => value?.streetAddress1
  },
  {
    title: 'Street Address 2',
    dataIndex: 'address',
    key: 'streetAddress2',
    displayOrder: 11,
    render: (value?: Address) => value?.streetAddress2
  },
  {
    title: 'City',
    dataIndex: 'address',
    key: 'city',
    displayOrder: 12,
    render: (value?: Address) => value?.city
  },
  {
    title: 'State',
    dataIndex: 'address',
    key: 'state',
    displayOrder: 13,
    render: (value?: Address) => value?.state
  },
  {
    title: 'Zip',
    dataIndex: 'address',
    key: 'zip',
    displayOrder: 14,
    render: (value?: Address) => value?.zip
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
    title: 'Teams',
    dataIndex: 'teams',
    render: (value: UserProfile['teams']) => value?.length ?? 0,
    align: 'center',
    key: 'teams',
    displayOrder: 17
  },
  {
    title: 'Family',
    dataIndex: 'family',
    key: 'family',
    displayOrder: 18
  }
];
