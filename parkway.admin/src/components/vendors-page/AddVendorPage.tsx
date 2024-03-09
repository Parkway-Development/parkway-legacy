import VendorForm from './VendorForm.tsx';
import { AddBaseApiEntityPage } from '../base-data-table-page';

const AddVendorPage = () => {
  return (
    <AddBaseApiEntityPage
      queryKey="vendors"
      baseApiType="vendorsApi"
      addForm={VendorForm}
      mainPage="/accounts/vendors"
    />
  );
};

export default AddVendorPage;
