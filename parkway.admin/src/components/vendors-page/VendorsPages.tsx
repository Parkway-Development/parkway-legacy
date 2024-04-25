import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import { Vendor } from '../../types';
import { vendorColumns } from './columns.tsx';
import VendorForm from './VendorForm.tsx';
import VendorDisplay from './VendorDisplay.tsx';

const sharedProps: SharedBasePageProps = {
  queryKey: 'vendors',
  baseApiType: 'vendorsApi',
  mainPage: '/accounts/vendors'
};

const VendorsPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={vendorColumns}
    title="Vendors"
    responsiveCardRenderer={(item) => item.name}
  />
);

const VendorPage = () => (
  <BaseDisplayPage
    {...sharedProps}
    render={(item: Vendor) => <VendorDisplay {...item} />}
  />
);

const AddVendorPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={VendorForm} />
);

const EditVendorPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={VendorForm} />
);

export { AddVendorPage, EditVendorPage, VendorsPage, VendorPage };
