import { Contribution } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import MoneyDisplay from '../money-display';
import DateDisplay from '../date-display';
import { UserNameDisplay } from '../user-name-display';
import ContributionTitle from './ContributionTitle.tsx';
import { AccountNameDisplayById } from '../account-name-display';
import styles from './ContributionDisplay.module.css';

const ContributionDisplay = (contribution: Contribution) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Gross Amount',
      children: <MoneyDisplay pennies={contribution.gross} />
    },
    {
      key: 2,
      label: 'Fees',
      children: <MoneyDisplay pennies={contribution.fees} />
    },
    {
      key: 3,
      label: 'Net Amount',
      children: <MoneyDisplay pennies={contribution.net} />
    },
    {
      key: 4,
      label: 'Transaction Date',
      children: <DateDisplay date={contribution.transactionDate} />
    },
    {
      key: 5,
      label: 'Deposit Id',
      children: contribution.depositId
    },
    {
      key: 6,
      label: 'Type',
      children: contribution.type
    },
    {
      key: 7,
      label: 'User Profile',
      children: <UserNameDisplay user={contribution.contributorProfileId} />
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
                  <MoneyDisplay pennies={amount} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <MoneyDisplay pennies={contribution.net} />
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
