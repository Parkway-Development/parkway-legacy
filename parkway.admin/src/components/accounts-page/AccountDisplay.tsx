import { Account } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import UserNameDisplay from '../user-name-display/UserNameDisplay.tsx';

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
      children: account.parent?.name
    },
    {
      key: 5,
      label: 'Children',
      children: (
        <>
          {account.children?.map((child) => (
            <p key={child.name}>{child.name}</p>
          ))}
        </>
      )
    },
    {
      key: 6,
      label: 'Custodian',
      children: account.custodian ? (
        <UserNameDisplay user={account.custodian} />
      ) : null
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
