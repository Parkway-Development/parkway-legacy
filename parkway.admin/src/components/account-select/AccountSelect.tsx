import {
  BaseEntitySelect,
  ExportedBaseEntitySelectProps
} from '../base-select';
import { Account } from '../../types';

const AccountSelect = (props: ExportedBaseEntitySelectProps) => {
  return (
    <BaseEntitySelect
      queryKey="accounts"
      baseApiType="accountsApi"
      renderer={(value: Account) => value.name}
      {...props}
    />
  );
};

export default AccountSelect;
