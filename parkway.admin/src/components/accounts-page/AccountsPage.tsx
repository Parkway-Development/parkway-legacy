import { Account } from '../../types';
import { BaseApiDataTablePage } from '../base-data-table-page';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import MoneyDisplay from '../money-display/MoneyDisplay.tsx';

const accountColumns: OrderedColumnsType<Account> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    displayOrder: 1
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'leader',
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

const AccountsPage = () => (
  <BaseApiDataTablePage
    queryKey="accounts"
    baseApiType="accountsApi"
    columns={accountColumns}
    title="Accounts"
  />
);

export default AccountsPage;
