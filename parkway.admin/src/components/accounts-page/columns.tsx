import { Account } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import UserNameDisplay from '../user-name-display/UserNameDisplay.tsx';

export const accountColumns: OrderedColumnsType<Account> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    displayOrder: 1
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
    render: (value: Account['parent']) => value?.name
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
