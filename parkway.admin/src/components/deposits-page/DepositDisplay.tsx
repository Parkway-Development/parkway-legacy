import {
  Alert,
  Button,
  Descriptions,
  DescriptionsProps,
  Spin,
  Table
} from 'antd';
import MoneyDisplay from '../money-display';
import DateDisplay from '../date-display';
import { UserNameDisplay } from '../user-name-display';
import AddContributionModal from './AddContributionModal.tsx';
import styles from './DepositDisplay.module.css';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { useQueries } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteButton from '../delete-button';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import { Contribution } from '../../types';

export const contributionColumns: OrderedColumnsType<Contribution> = [
  {
    title: 'Contributor',
    width: 200,
    dataIndex: 'contributorProfileId',
    render: (value: Contribution['contributorProfileId']) => (
      <UserNameDisplay user={value} />
    ),
    key: 'contributorProfileId',
    displayOrder: 1
  },
  {
    title: 'Gross',
    dataIndex: 'gross',
    key: 'gross',
    align: 'right',
    displayOrder: 2,
    render: (value: Contribution['gross']) => <MoneyDisplay pennies={value} />
  },
  {
    title: 'Fees',
    dataIndex: 'fees',
    key: 'fees',
    align: 'right',
    displayOrder: 3,
    render: (value: Contribution['fees']) => <MoneyDisplay pennies={value} />
  },
  {
    title: 'Net',
    dataIndex: 'net',
    key: 'net',
    align: 'right',
    displayOrder: 4,
    render: (value: Contribution['net']) => <MoneyDisplay pennies={value} />
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    displayOrder: 5
  }
];

const DepositDisplay = () => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const {
    contributionsApi: { getByDepositId },
    depositsApi: { getById, delete: deleteFn },
    formatError
  } = useApi();

  const [depositQuery, contributionQuery] = useQueries({
    queries: [
      {
        queryKey: buildQueryKey('deposits', id),
        queryFn: getById(id!),
        enabled: id !== undefined
      },
      {
        queryKey: buildQueryKey('contributions', `depositId_${id}`),
        queryFn: () => getByDepositId(id!),
        enabled: id !== undefined
      }
    ]
  });

  const error = [depositQuery, contributionQuery].reduce(
    (p: Error | null, c) => (p ? p : c.error),
    null
  );

  const isLoading = [depositQuery, contributionQuery].some(
    (query) => query.isLoading
  );

  if (!id) {
    return <Alert type="error" message="Invalid id" />;
  }

  if (error) {
    return <Alert type="error" message={formatError(error)} />;
  }

  const deposit = depositQuery.data?.data;
  const contributions = contributionQuery.data?.data;

  if (isLoading || !deposit) {
    return <Spin />;
  }

  const handleCancel = () => navigate('/accounts/deposits');

  const handleEdit = () => navigate('./edit');

  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Created Date',
      children: <DateDisplay date={deposit.created} />
    },
    {
      key: 2,
      label: 'Status Date',
      children: <DateDisplay date={deposit.statusDate} />
    },
    {
      key: 3,
      label: 'Amount',
      children: <MoneyDisplay pennies={deposit.amount} />
    },
    {
      key: 4,
      label: 'Status',
      children: deposit.currentStatus
    },
    {
      key: 5,
      label: 'Responsible Party',
      children: <UserNameDisplay user={deposit.responsiblePartyProfileId} />
    }
  ];

  return (
    <>
      <div className={styles.header}>
        <Button onClick={handleCancel} type="primary">
          Close
        </Button>
        <Button onClick={handleEdit}>Edit</Button>
        <DeleteButton
          id={id}
          deleteFn={deleteFn}
          isIconButton={false}
          onSuccess={handleCancel}
        />
      </div>
      <Descriptions
        size="small"
        title={<DateDisplay date={deposit.created} />}
        items={items}
        bordered
        column={1}
      />
      <div className={styles.actionsContainer}>
        <AddContributionModal deposit={deposit} />
      </div>
      <Table
        size="small"
        columns={contributionColumns}
        dataSource={contributions}
        caption={error ? formatError(error) : undefined}
      />
    </>
  );
};

export default DepositDisplay;
