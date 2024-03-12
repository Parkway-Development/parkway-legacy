import AssetForm from './AssetForm.tsx';
import { AddBaseApiEntityPage } from '../base-data-table-page';

const AddAssetPage = () => {
  return (
    <AddBaseApiEntityPage
      queryKey="assets"
      baseApiType="assetsApi"
      addForm={AssetForm}
      mainPage="/accounts/assets"
    />
  );
};

export default AddAssetPage;
