import { Account } from '../../types';
import { useState } from 'react';
import { Alert, Button } from 'antd';
import AccountSelect from '../account-select';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AccountParentProps = {
  account: Account;
};

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
      <>
        <AccountSelect
          style={{ minWidth: 250 }}
          value={newParent}
          onChange={(value) => setNewParent(value)}
          disabled={isPending}
        />
        <Button
          onClick={handleUpdateParent}
          style={{ marginLeft: '1em' }}
          type="primary"
          loading={isPending}
          disabled={!newParent}
        >
          Update
        </Button>
        {error && <Alert type="error" message={formatError(error)} />}
      </>
    );
  }

  if (account.parent) {
    return (
      <span>
        {account.parent.name}
        <Button
          onClick={() => setIsEditing(true)}
          type="link"
          style={{ marginLeft: '1em' }}
        >
          Update
        </Button>
      </span>
    );
  }

  return (
    <span>
      None
      <Button
        onClick={() => setIsEditing(true)}
        type="link"
        style={{ marginLeft: '1em' }}
      >
        Add Parent
      </Button>
    </span>
  );
};

export default AccountParent;
