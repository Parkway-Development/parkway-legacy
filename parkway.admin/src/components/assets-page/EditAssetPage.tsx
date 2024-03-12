import AssetForm from './AssetForm.tsx';
import { EditBaseApiEntityPage } from '../base-data-table-page';

const EditAssetPage = () => {
  return (
    <EditBaseApiEntityPage
      queryKey="assets"
      baseApiType="assetsApi"
      editForm={AssetForm}
      mainPage="/accounts/assets"
    />
  );
};

export default EditAssetPage;
