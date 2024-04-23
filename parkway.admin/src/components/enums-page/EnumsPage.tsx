import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import EnumDisplay from './EnumDisplay.tsx';
import EnumForm from './EnumForm.tsx';
import { enumColumns } from './columns.tsx';

const sharedProps: SharedBasePageProps = {
  queryKey: 'enums',
  baseApiType: 'enumsApi',
  mainPage: '/platform/enums'
};

const EnumsPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={enumColumns}
    title="Enums"
    responsiveCardRenderer={(item) => item.name}
  />
);

const EnumPage = () => (
  <BaseDisplayPage {...sharedProps} render={EnumDisplay} />
);

const AddEnumPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={EnumForm} />
);

const EditEnumPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={EnumForm} />
);

export { AddEnumPage, EditEnumPage, EnumsPage, EnumPage };
