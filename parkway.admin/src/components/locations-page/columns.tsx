import { Address, Location } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';

export const columns: OrderedColumnsType<Location> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    displayOrder: 1
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    displayOrder: 2
  },
  {
    title: 'Street Address 1',
    dataIndex: 'address',
    key: 'streetAddress1',
    displayOrder: 3,
    render: (value?: Address) => value?.streetAddress1
  },
  {
    title: 'Street Address 2',
    dataIndex: 'address',
    key: 'streetAddress2',
    displayOrder: 4,
    render: (value?: Address) => value?.streetAddress2
  },
  {
    title: 'City',
    dataIndex: 'address',
    key: 'city',
    displayOrder: 5,
    render: (value?: Address) => value?.city
  },
  {
    title: 'State',
    dataIndex: 'address',
    key: 'state',
    displayOrder: 6,
    render: (value?: Address) => value?.state
  },
  {
    title: 'Zip',
    dataIndex: 'address',
    key: 'zip',
    displayOrder: 7,
    render: (value?: Address) => value?.zip
  },
  {
    title: 'Country',
    dataIndex: 'address',
    key: 'country',
    displayOrder: 8,
    render: (value?: Address) => value?.country
  }
];
