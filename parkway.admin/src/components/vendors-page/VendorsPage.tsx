import { BaseApiDataTablePage } from '../base-data-table-page';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import { Vendor } from '../../types';

const vendorColumns: OrderedColumnsType<Vendor> = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 200,
    key: 'name',
    displayOrder: 1
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    displayOrder: 2
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    displayOrder: 3
  },
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
    displayOrder: 4
  },
  {
    title: 'Zip',
    dataIndex: 'zip',
    key: 'zip',
    displayOrder: 5
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    displayOrder: 6
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    displayOrder: 7
  },
  {
    title: 'Website',
    dataIndex: 'website',
    key: 'website',
    displayOrder: 8
  },
  {
    title: 'Contact',
    dataIndex: 'contact',
    key: 'contact',
    displayOrder: 9
  },
  {
    title: 'Contact Phone',
    dataIndex: 'contactPhone',
    key: 'contactPhone',
    displayOrder: 10
  },
  {
    title: 'Contact Email',
    dataIndex: 'contactEmail',
    key: 'contactEmail',
    displayOrder: 11
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
    displayOrder: 12
  }
];

const VendorsPage = () => (
  <BaseApiDataTablePage
    queryKey="vendors"
    baseApiType="vendorsApi"
    columns={vendorColumns}
    title="Vendors"
  />
);

export default VendorsPage;
