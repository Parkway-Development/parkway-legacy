import { Deposit } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import MoneyDisplay from '../money-display';
import DateDisplay from '../date-display';
import { UserNameDisplay } from '../user-name-display';
import AddContributionModal from './AddContributionModal.tsx';
import styles from './DepositDisplay.module.css';

const DepositDisplay = (deposit: Deposit) => {
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
    </>
  );
};

export default DepositDisplay;
