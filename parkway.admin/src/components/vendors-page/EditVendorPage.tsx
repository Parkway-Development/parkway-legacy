import VendorForm from './VendorForm.tsx';
import { EditBaseApiEntityPage } from '../base-data-table-page';

const EditVendorPage = () => {
  return (
    <EditBaseApiEntityPage
      queryKey="vendors"
      baseApiType="vendorsApi"
      editForm={VendorForm}
      mainPage="/accounts/vendors"
    />
  );
};

export default EditVendorPage;
