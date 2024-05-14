import { Account } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import AccountParent from './AccountParent.tsx';
import { Link } from 'react-router-dom';
import styles from './AccountDisplay.module.css';
import AccountCustodian from './AccountCustodian.tsx';

const AccountDisplay = (account: Account) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Description',
      children: account.description
    },
    {
      key: 2,
      label: 'Type',
      children: account.type
    },
    {
      key: 3,
      label: 'Sub Type',
      children: account.subtype
    },
    {
      key: 4,
      label: 'Parent',
      children: <AccountParent account={account} />
    },
    {
      key: 5,
      label: 'Children',
      children: (
        <ol className={styles.childrenList}>
          {account.children?.map((child) => (
            <li key={child._id}>
              <Link to={`/accounts/${child._id}`}>{child.name}</Link>
            </li>
          ))}
        </ol>
      )
    },
    {
      key: 6,
      label: 'Custodian',
      children: <AccountCustodian account={account} />
    },
    {
      key: 7,
      label: 'Notes',
      children: (
        <>{account.notes?.map((note, index) => <p key={index}>{note}</p>)}</>
      )
    }
  ];

  return (
    <Descriptions
      size="small"
      title={account.name}
      items={items}
      bordered
      column={1}
    />
  );
};

export default AccountDisplay;
