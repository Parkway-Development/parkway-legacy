import { Account } from '../../types';
import { useState } from 'react';
import { Alert, Button } from 'antd';
import AccountSelect from '../account-select';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './AccountParent.module.css';
import { Link } from 'react-router-dom';

interface AccountParentProps {
  account: Account;
}

const AccountParent = ({ account }: AccountParentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newParent, setNewParent] = useState<string | undefined>(
    account.parent?._id
  );
  const queryClient = useQueryClient();
  const {
    accountsApi: { addParent },
    formatError
  } = useApi();

  const { mutate, error, isPending } = useMutation({
    mutationFn: addParent
  });

  const handleUpdateParent = () => {
    // TODO: Handle clearing the parent later on when supported on API?
    if (!newParent) {
      return;
    }

    mutate(
      { _id: account._id, parent: newParent },
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
      <div className={styles.accountSelect}>
        <AccountSelect
          value={newParent}
          onChange={(value) => setNewParent(value)}
          disabled={isPending}
          excludedIds={[account._id]}
        />
        <Button
          onClick={handleUpdateParent}
          type="primary"
          loading={isPending}
          disabled={!newParent || newParent === account.parent?._id}
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

  if (account.parent) {
    return (
      <span className={styles.accountSelect}>
        <Link to={`/accounts/${account.parent._id}`}>
          {account.parent.name}
        </Link>
        <Button onClick={() => setIsEditing(true)} type="link">
          Update
        </Button>
      </span>
    );
  }

  return (
    <span className={styles.accountSelect}>
      None
      <Button onClick={() => setIsEditing(true)} type="link">
        Add Parent
      </Button>
    </span>
  );
};

export default AccountParent;
