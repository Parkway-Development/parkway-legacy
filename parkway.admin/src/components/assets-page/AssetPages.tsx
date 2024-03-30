import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { assetColumns } from './columns.tsx';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import AssetDisplay from './AssetDisplay.tsx';
import AssetForm from './AssetForm.tsx';

const sharedProps: SharedBasePageProps = {
  queryKey: 'assets',
  baseApiType: 'assetsApi',
  mainPage: '/accounts/assets'
};

const AssetsPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={assetColumns}
    responsiveCardRenderer={(asset) => asset.name}
  />
);

const AssetPage = () => (
  <BaseDisplayPage {...sharedProps} render={AssetDisplay} />
);

const AddAssetPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={AssetForm} />
);

const EditAssetPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={AssetForm} />
);

export { AddAssetPage, EditAssetPage, AssetsPage, AssetPage };
