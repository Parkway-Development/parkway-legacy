import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { depositColumns } from './columns.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import DepositDisplay from './DepositDisplay.tsx';
import DepositForm from './DepositForm.tsx';
import DateDisplay from '../date-display';
import { Deposit, DepositStatus } from '../../types';
import { useParams } from 'react-router-dom';

const sharedProps: SharedBasePageProps = {
  queryKey: 'deposits',
  baseApiType: 'depositsApi',
  mainPage: '/accounts/deposits'
};

const DepositsPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={depositColumns}
    allowEdit={(item) => item.currentStatus !== DepositStatus.Processed}
    responsiveCardRenderer={(deposit) => (
      <DateDisplay date={deposit.createdAt} />
    )}
  />
);

const DepositPage = () => <DepositDisplay />;

const AddDepositPage = () => (
  <AddBaseApiEntityPage
    {...sharedProps}
    addForm={DepositForm}
    onAddRedirectUrl={(data: Deposit) => `/accounts/deposits/${data._id}`}
  />
);

const EditDepositPage = () => {
  const params = useParams();
  const id = params.id;
  return (
    <EditBaseApiEntityPage
      {...sharedProps}
      editForm={DepositForm}
      mainPage={`/accounts/deposits/${id}`}
    />
  );
};

export { AddDepositPage, EditDepositPage, DepositsPage, DepositPage };
