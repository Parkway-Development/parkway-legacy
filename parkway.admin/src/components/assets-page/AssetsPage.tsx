import { Asset } from '../../types';
import { BaseApiDataTablePage } from '../base-data-table-page';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import MoneyDisplay from '../money-display';
import DateDisplay from '../date-display';

const assetColumns: OrderedColumnsType<Asset> = [
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
    title: 'Value',
    dataIndex: 'value',
    align: 'right',
    key: 'value',
    displayOrder: 3,
    render: (value: Asset['value']) => <MoneyDisplay money={value} />
  },
  {
    title: 'Purchase Date',
    dataIndex: 'purchaseDate',
    key: 'purchaseDate',
    displayOrder: 4,
    render: (value: Asset['purchaseDate']) => <DateDisplay date={value} />
  },
  {
    title: 'Depreciation Type',
    dataIndex: 'depreciationType',
    key: 'depreciationType',
    displayOrder: 5
  },
  {
    title: 'In Service Date',
    dataIndex: 'inServiceDate',
    key: 'inServiceDate',
    displayOrder: 6,
    render: (value: Asset['inServiceDate']) => <DateDisplay date={value} />
  },
  {
    title: 'Useful Life In Days',
    dataIndex: 'usefulLifeInDays',
    key: 'usefulLifeInDays',
    displayOrder: 7
  },
  {
    title: 'Asset Type',
    dataIndex: 'assetType',
    key: 'assetTypes',
    displayOrder: 8
  },
  {
    title: 'Asset Category',
    dataIndex: 'assetCategory',
    key: 'assetCategory',
    displayOrder: 9
  },
  {
    title: 'Asset Location',
    dataIndex: 'assetLocation',
    key: 'assetLocation',
    displayOrder: 10
  },
  {
    title: 'Asset Status',
    dataIndex: 'assetStatus',
    key: 'assetStatus',
    displayOrder: 11
  },
  {
    title: 'Asset Condition',
    dataIndex: 'assetCondition',
    key: 'assetCondition',
    displayOrder: 12
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
    displayOrder: 13,
    render: (value: Asset['notes']) => value?.length ?? 0
  }
];

const AssetsPage = () => (
  <BaseApiDataTablePage
    queryKey="assets"
    baseApiType="assetsApi"
    columns={assetColumns}
    title="Assets"
    responsiveCardRenderer={(asset) => asset.name}
  />
);

export default AssetsPage;
