import { Account } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import MoneyDisplay from '../money-display';

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
    title: 'Target Amount',
    dataIndex: 'targetAmount',
    align: 'right',
    key: 'targetAmount',
    displayOrder: 3,
    render: (value: Account['targetAmount']) => <MoneyDisplay money={value} />
  },
  {
    title: 'Current Amount',
    dataIndex: 'currentAmount',
    key: 'currentAmount',
    align: 'right',
    displayOrder: 4,
    render: (value: Account['currentAmount']) => <MoneyDisplay money={value} />
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
    displayOrder: 5,
    render: (value: Account['notes']) => value?.length ?? 0
  }
];
