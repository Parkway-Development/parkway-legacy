import { Contribution } from '../../types/Contribution.ts';
import { BaseApiDataTablePage } from '../base-data-table-page';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import UserDisplayById from '../user-display/UserDisplayById.tsx';
import { LockOutlined } from '@ant-design/icons';
import DateDisplay from '../date-display/DateDisplay.tsx';
import MoneyDisplay from '../money-display/MoneyDisplay.tsx';

const contributionColumns: OrderedColumnsType<Contribution> = [
  {
    title: 'Total',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    align: 'right',
    displayOrder: 1,
    render: (value: Contribution['totalAmount']) => (
      <MoneyDisplay money={value} />
    )
  },
  {
    title: 'Transaction Date',
    dataIndex: 'transactionDate',
    key: 'transactionDate',
    displayOrder: 2,
    render: (value: Contribution['transactionDate']) => (
      <DateDisplay date={value} />
    )
  },
  {
    title: 'Deposit Date',
    dataIndex: 'depositDate',
    key: 'depositDate',
    displayOrder: 3,
    render: (value: Contribution['depositDate']) => <DateDisplay date={value} />
  },
  {
    title: 'Locked',
    dataIndex: 'locked',
    align: 'center',
    key: 'locked',
    displayOrder: 4,
    render: (value: Contribution['locked']) => {
      if (!value) return undefined;
      return <LockOutlined />;
    }
  },
  {
    title: 'Deposit Batch Id',
    dataIndex: 'depositBatchId',
    key: 'depositBatchId',
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
    render: (value: Contribution['profile']) => <UserDisplayById id={value} />,
    key: 'profile',
    displayOrder: 8
  }
];

const ContributionsPage = () => (
  <BaseApiDataTablePage
    queryKey="contributions"
    baseApiType="contributionsApi"
    columns={contributionColumns}
    title="Contributions"
  />
);

export default ContributionsPage;
