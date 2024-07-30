import { Contribution } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import { UserNameDisplay } from '../user-name-display';
import DateDisplay from '../date-display';
import MoneyDisplay from '../money-display';
import { Link } from 'react-router-dom';

export const contributionColumns: OrderedColumnsType<Contribution> = [
  {
    title: 'Gross',
    dataIndex: 'gross',
    key: 'gross',
    align: 'right',
    displayOrder: 1,
    render: (value: Contribution['gross']) => <MoneyDisplay pennies={value} />
  },
  {
    title: 'Fees',
    dataIndex: 'fees',
    key: 'fees',
    align: 'right',
    displayOrder: 2,
    render: (value: Contribution['fees']) => <MoneyDisplay pennies={value} />
  },
  {
    title: 'Net',
    dataIndex: 'net',
    key: 'net',
    align: 'right',
    displayOrder: 3,
    render: (value: Contribution['net']) => <MoneyDisplay pennies={value} />
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
    displayOrder: 5,
    render: (value: Contribution['depositId']) => (
      <Link to={`/accounts/deposits/${value}`}>{value}</Link>
    )
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
    title: 'Contributor',
    width: 200,
    dataIndex: 'contributorProfileId',
    render: (value: Contribution['contributorProfileId']) => (
      <UserNameDisplay user={value} />
    ),
    key: 'contributorProfileId',
    displayOrder: 8
  }
];
