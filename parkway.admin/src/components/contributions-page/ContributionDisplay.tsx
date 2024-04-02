import { Contribution } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import MoneyDisplay from '../money-display';
import DateDisplay from '../date-display';
import { UserNameDisplayById } from '../user-name-display';
import ContributionTitle from './ContributionTitle.tsx';
import { AccountNameDisplayById } from '../account-name-display';
import styles from './ContributionDisplay.module.css';

const ContributionDisplay = (contribution: Contribution) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Total Amount',
      children: <MoneyDisplay money={contribution.totalAmount} />
    },
    {
      key: 2,
      label: 'Transaction Date',
      children: <DateDisplay date={contribution.transactionDate} />
    },
    {
      key: 3,
      label: 'Deposit Date',
      children: <DateDisplay date={contribution.depositDate} />
    },
    {
      key: 4,
      label: 'Locked',
      children: contribution.locked ? 'Y' : 'N'
    },
    {
      key: 5,
      label: 'Deposit Batch Id',
      children: contribution.depositBatchId
    },
    {
      key: 6,
      label: 'Type',
      children: contribution.type
    },
    {
      key: 7,
      label: 'User Profile',
      children: <UserNameDisplayById id={contribution.profile} />
    },
    {
      key: 8,
      label: 'Accounts',
      children: (
        <table className={styles.accountsTable}>
          <thead>
            <tr>
              <th>Account</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {contribution.accounts?.map(({ account, amount }, index) => (
              <tr key={index}>
                <td>
                  <AccountNameDisplayById id={account} />:
                </td>
                <td>
                  <MoneyDisplay money={amount} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <MoneyDisplay money={contribution.totalAmount} />
              </td>
            </tr>
          </tfoot>
        </table>
      )
    }
  ];

  return (
    <Descriptions
      size="small"
      title={<ContributionTitle contribution={contribution} />}
      items={items}
      bordered
      column={1}
    />
  );
};

export default ContributionDisplay;
