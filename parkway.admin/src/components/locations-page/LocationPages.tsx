import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import LocationForm from './LocationForm.tsx';
import { columns } from './columns.tsx';
import LocationDisplay from './LocationDisplay.tsx';

const sharedProps: SharedBasePageProps = {
  queryKey: 'locations',
  baseApiType: 'locationsApi',
  mainPage: '/locations'
};

const LocationsPage = () => {
  return (
    <BaseApiDataTablePage
      {...sharedProps}
      columns={columns}
      title="Locations"
      responsiveCardRenderer={(item) => item.name}
    />
  );
};

const LocationPage = () => (
  <BaseDisplayPage {...sharedProps} render={LocationDisplay} />
);

const AddLocationPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={LocationForm} />
);

const EditLocationPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={LocationForm} />
);

export { AddLocationPage, EditLocationPage, LocationsPage, LocationPage };
