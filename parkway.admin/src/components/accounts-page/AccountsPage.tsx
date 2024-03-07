import { Account } from '../../types/Account.ts';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQueryClient } from '@tanstack/react-query';
import BaseDataTablePage from '../base-data-table-page/BaseDataTablePage.tsx';
import useColumns, { OrderedColumnsType } from '../../hooks/useColumns.tsx';

const teamColumns: OrderedColumnsType<Account> = [
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
    displayOrder: 5
  }
];

const AccountsPage = () => {
  const queryClient = useQueryClient();
  const queryKey = buildQueryKey('accounts');
  const {
    accountsApi: { delete: deleteFn, getAll }
  } = useApi();

  const handleDelete = () => {
    queryClient.invalidateQueries({
      queryKey
    });
  };

  const { columns } = useColumns({
    columns: teamColumns,
    columnType: 'accountsPage',
    deleteAction: { deleteFn, handleDelete },
    editLink: ({ _id }) => `/accounts/${_id}/edit`
  });

  return (
    <BaseDataTablePage
      addLink="/accounts/add"
      queryFn={getAll}
      queryKey={queryKey}
      columns={columns}
      title="Accounts"
    />
  );
};

export default AccountsPage;
