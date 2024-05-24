import { ContributionAccount } from '../../types';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import AccountSelect from '../account-select';
import { Button, Input } from 'antd';
import styles from './AccountsInput.module.css';
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import MoneyDisplay from '../money-display';

interface ContributionAccountInput {
  account: string | undefined;
  amount: number;
}

interface AccountsInputProps {
  totalAmount: number;
  onChange: (accounts: ContributionAccount[], isValid: boolean) => void;
  initialValue: ContributionAccount[] | undefined;
}

const AccountsInput = ({
  onChange,
  totalAmount,
  initialValue
}: AccountsInputProps) => {
  const [accounts, setAccounts] = useState<ContributionAccountInput[]>(() => {
    return initialValue ?? [{ account: undefined, amount: 0 }];
  });

  const currentTotal = accounts.reduce((p, account) => p + account.amount, 0);
  const remaining =
    totalAmount === undefined || Number.isNaN(totalAmount)
      ? 0
      : totalAmount - currentTotal;

  useEffect(() => {
    const changeValues = accounts
      .filter((account) => account.account !== undefined)
      .map(({ account, amount }) => ({ account: account!, amount }));

    onChange(changeValues, totalAmount > 0 && remaining === 0);
  }, [accounts, remaining]);

  const handleAccountChange = useCallback(
    (index: number, value: string | undefined) => {
      setAccounts((prev) =>
        prev.map((input, i) =>
          i === index ? { ...input, account: value } : input
        )
      );
    },
    []
  );

  const handleAmountChange = useCallback((index: number, value: string) => {
    let amount = parseFloat(value);

    if (Number.isNaN(amount)) {
      amount = 0;
    }

    setAccounts((prev) =>
      prev.map((input, i) => (i === index ? { ...input, amount } : input))
    );
  }, []);

  const handleAddRow = () => {
    setAccounts((prev) => [...prev, { account: undefined, amount: 0 }]);
  };

  const handleDeleteRow = (rowIndex: number) => {
    setAccounts((prev) => prev.filter((_, index) => index !== rowIndex));
  };

  const rows = accounts.map((input, index) => {
    return (
      <div key={index} className={styles.accountRow}>
        <AccountSelect
          value={input.account}
          onChange={(value) => handleAccountChange(index, value)}
        />
        <Input
          type="number"
          step={0.01}
          onChange={(e: SyntheticEvent<HTMLInputElement>) =>
            handleAmountChange(index, e.currentTarget.value)
          }
          value={input.amount}
        />
        <Button onClick={handleAddRow}>
          <PlusCircleOutlined />
        </Button>
        <Button
          onClick={() => handleDeleteRow(index)}
          disabled={accounts.length <= 1}
        >
          <CloseOutlined />
        </Button>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      {rows}
      <div className={styles.footerLabel}>
        <span>Current Total:</span>
        <MoneyDisplay money={currentTotal} />
      </div>
      <div className={styles.footerLabel}>
        <span>Remaining:</span>
        <MoneyDisplay money={remaining} />
      </div>
    </div>
  );
};

export default AccountsInput;
