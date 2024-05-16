import { Account } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import UserNameDisplay from '../user-name-display/UserNameDisplay.tsx';
import { Link } from 'react-router-dom';

export const accountColumns: OrderedColumnsType<Account> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    displayOrder: 1,
    render: (value: Account['name'], account) => (
      <Link to={`/accounts/${account._id}`}>{value}</Link>
    )
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    displayOrder: 2
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    displayOrder: 3
  },
  {
    title: 'Sub Type',
    dataIndex: 'subtype',
    key: 'subtype',
    displayOrder: 4
  },
  {
    title: 'Parent',
    dataIndex: 'parent',
    key: 'parent',
    displayOrder: 5,
    render: (value: Account['parent']) =>
      value ? <Link to={`/accounts/${value._id}`}>{value.name}</Link> : null
  },
  {
    title: 'Children',
    dataIndex: 'children',
    key: 'children',
    displayOrder: 6,
    render: (value: Account['children']) => value?.length ?? 0
  },
  {
    title: 'Custodian',
    dataIndex: 'custodian',
    key: 'custodian',
    displayOrder: 7,
    render: (value: Account['custodian']) =>
      value ? <UserNameDisplay user={value} /> : null
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
    displayOrder: 8,
    render: (value: Account['notes']) => value?.length ?? 0
  }
];
