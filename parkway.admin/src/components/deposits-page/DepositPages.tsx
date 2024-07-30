import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { depositColumns } from './columns.tsx';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import DepositDisplay from './DepositDisplay.tsx';
import DepositForm from './DepositForm.tsx';
import DateDisplay from '../date-display';

const sharedProps: SharedBasePageProps = {
  queryKey: 'deposits',
  baseApiType: 'depositsApi',
  mainPage: '/accounts/deposits'
};

const DepositsPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={depositColumns}
    responsiveCardRenderer={(deposit) => <DateDisplay date={deposit.created} />}
  />
);

const DepositPage = () => (
  <BaseDisplayPage {...sharedProps} render={DepositDisplay} />
);

const AddDepositPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={DepositForm} />
);

const EditDepositPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={DepositForm} />
);

export { AddDepositPage, EditDepositPage, DepositsPage, DepositPage };
