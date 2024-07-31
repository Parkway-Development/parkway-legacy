import { Deposit } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import MoneyDisplay from '../money-display';
import { UserNameDisplay } from '../user-name-display';
import DateDisplay from '../date-display';
import { Link } from 'react-router-dom';

export const depositColumns: OrderedColumnsType<Deposit> = [
  {
    title: 'Created Date',
    dataIndex: 'created',
    key: 'created',
    displayOrder: 1,
    render: (value: Deposit['created'], deposit) => (
      <Link to={`/accounts/deposits/${deposit._id}`}>
        <DateDisplay date={value} />
      </Link>
    )
  },
  {
    title: 'Status Date',
    dataIndex: 'statusDate',
    key: 'statusDate',
    displayOrder: 2,
    render: (value: Deposit['statusDate']) => <DateDisplay date={value} />
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    align: 'right',
    displayOrder: 3,
    render: (value: Deposit['amount']) => <MoneyDisplay pennies={value} />
  },
  {
    title: 'Status',
    dataIndex: 'currentStatus',
    key: 'currentStatus',
    displayOrder: 4
  },
  {
    title: 'Responsible Party',
    dataIndex: 'responsiblePartyProfileId',
    key: 'responsiblePartyProfileId',
    displayOrder: 5,
    render: (value: Deposit['responsiblePartyProfileId']) => (
      <UserNameDisplay user={value} />
    )
  }
];
