import { Account } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import MoneyDisplay from '../money-display';

const AccountDisplay = (account: Account) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Description',
      children: account.description
    },
    {
      key: 2,
      label: 'Target Amount',
      children: <MoneyDisplay money={account.targetAmount} />
    },
    {
      key: 3,
      label: 'Current Value',
      children: <MoneyDisplay money={account.currentAmount} />
    },
    {
      key: 4,
      label: 'Notes',
      span: 3,
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
