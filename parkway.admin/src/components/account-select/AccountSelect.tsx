import {
  BaseEntitySelect,
  ExportedBaseEntitySelectProps
} from '../base-select';
import { Account } from '../../types';
import { useCallback } from 'react';

const AccountSelect = (props: ExportedBaseEntitySelectProps) => {
  const renderer = useCallback((value: Account) => value.name, []);

  return (
    <BaseEntitySelect
      queryKey="accounts"
      baseApiType="accountsApi"
      renderer={renderer}
      {...props}
    />
  );
};

export default AccountSelect;
