import { Account } from '../../types';
import { useState } from 'react';
import { Alert, Button } from 'antd';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './AccountCustodian.module.css';
import UserProfileSelect from '../user-profile-select';
import UserNameDisplay from '../user-name-display/UserNameDisplay.tsx';

type AccountCustodianProps = {
  account: Account;
};

const AccountCustodian = ({ account }: AccountCustodianProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newCustodian, setNewCustodian] = useState<string | undefined>(
    typeof account.custodian === 'string'
      ? account.custodian
      : account.custodian?._id
  );
  const queryClient = useQueryClient();
  const {
    accountsApi: { updateCustodian },
    formatError
  } = useApi();

  const { mutate, error, isPending } = useMutation({
    mutationFn: updateCustodian
  });

  const handleUpdateParent = () => {
    if (!newCustodian) {
      return;
    }

    mutate(
      { _id: account._id, custodian: newCustodian },
      {
        onSuccess: (response) => {
          queryClient.setQueryData(
            buildQueryKey('accounts', account._id),
            response
          );
          setIsEditing(false);
        }
      }
    );
  };

  if (isEditing) {
    return (
      <div className={styles.accountCustodian}>
        <UserProfileSelect
          initialValue={newCustodian}
          onChange={(value: string | undefined) => setNewCustodian(value)}
          disabled={isPending}
        />
        <Button
          onClick={handleUpdateParent}
          type="primary"
          loading={isPending}
          disabled={!newCustodian || newCustodian === account.custodian}
        >
          Update
        </Button>
        <Button onClick={() => setIsEditing(false)} loading={isPending}>
          Cancel
        </Button>
        {error && <Alert type="error" message={formatError(error)} />}
      </div>
    );
  }

  if (account.custodian) {
    return (
      <span className={styles.accountCustodian}>
        <UserNameDisplay user={account.custodian} />
        <Button onClick={() => setIsEditing(true)} type="link">
          Update
        </Button>
      </span>
    );
  }

  return (
    <span className={styles.accountCustodian}>
      None
      <Button onClick={() => setIsEditing(true)} type="link">
        Add Custodian
      </Button>
    </span>
  );
};

export default AccountCustodian;
