import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import AccountForm from './AccountForm.tsx';
import { accountColumns } from './columns.tsx';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import AccountDisplay from './AccountDisplay.tsx';

const sharedProps: SharedBasePageProps = {
  queryKey: 'accounts',
  baseApiType: 'accountsApi',
  mainPage: '/accounts'
};

const AccountsPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={accountColumns}
    responsiveCardRenderer={(account) => account.name}
    allowEdit={false}
    allowDelete={false}
  />
);

const AccountPage = () => (
  <BaseDisplayPage {...sharedProps} render={AccountDisplay} />
);

const AddAccountPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={AccountForm} />
);

const EditAccountPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={AccountForm} />
);

export { AddAccountPage, EditAccountPage, AccountsPage, AccountPage };
