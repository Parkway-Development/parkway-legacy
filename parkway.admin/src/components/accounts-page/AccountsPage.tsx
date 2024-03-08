import { Account } from '../../types/Account.ts';
import { BaseApiDataTablePage } from '../base-data-table-page/BaseDataTablePage.tsx';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';

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
    displayOrder: 3
  },
  {
    title: 'Current Amount',
    dataIndex: 'currentAmount',
    key: 'currentAmount',
    align: 'right',
    displayOrder: 4
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
