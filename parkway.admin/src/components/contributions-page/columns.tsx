import { Contribution } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import { UserNameDisplayById } from '../user-name-display';
import DateDisplay from '../date-display';
import MoneyDisplay from '../money-display';

export const contributionColumns: OrderedColumnsType<Contribution> = [
  {
    title: 'Gross',
    dataIndex: 'gross',
    key: 'gross',
    align: 'right',
    displayOrder: 1,
    render: (value: Contribution['gross']) => <MoneyDisplay money={value} />
  },
  {
    title: 'Fees',
    dataIndex: 'fees',
    key: 'fees',
    align: 'right',
    displayOrder: 2,
    render: (value: Contribution['fees']) => <MoneyDisplay money={value} />
  },
  {
    title: 'Net',
    dataIndex: 'net',
    key: 'net',
    align: 'right',
    displayOrder: 3,
    render: (value: Contribution['net']) => <MoneyDisplay money={value} />
  },
  {
    title: 'Transaction Date',
    dataIndex: 'transactionDate',
    key: 'transactionDate',
    displayOrder: 4,
    render: (value: Contribution['transactionDate']) => (
      <DateDisplay date={value} />
    )
  },
  {
    title: 'Deposit Id',
    dataIndex: 'depositId',
    key: 'depositId',
    displayOrder: 5
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    displayOrder: 6
  },
  {
    title: 'Accounts',
    dataIndex: 'accounts',
    key: 'accounts',
    displayOrder: 7,
    align: 'center',
    render: (value: Contribution['accounts']) => value?.length ?? 0
  },
  {
    title: 'User Profile',
    width: 200,
    dataIndex: 'profile',
    render: (value: Contribution['profile']) => (
      <UserNameDisplayById id={value} />
    ),
    key: 'profile',
    displayOrder: 8
  }
];
