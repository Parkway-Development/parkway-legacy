import { Asset } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import MoneyDisplay from '../money-display';
import DateDisplay from '../date-display';

const AssetDisplay = (asset: Asset) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Description',
      children: asset.description
    },
    {
      key: 2,
      label: 'Value',
      children: <MoneyDisplay money={asset.value} />
    },
    {
      key: 3,
      label: 'Purchase Date',
      children: <DateDisplay date={asset.purchaseDate} />
    },
    {
      key: 4,
      label: 'Depreciation Type',
      children: asset.depreciationType
    },
    {
      key: 5,
      label: 'In Service Date',
      children: <DateDisplay date={asset.inServiceDate} />
    },
    {
      key: 6,
      label: 'Useful Life in Days',
      children: asset.usefulLifeInDays
    },
    {
      key: 7,
      label: 'Type',
      children: asset.assetType
    },
    {
      key: 8,
      label: 'Category',
      children: asset.assetCategory
    },
    {
      key: 9,
      label: 'Location',
      children: asset.assetLocation
    },
    {
      key: 10,
      label: 'Status',
      children: asset.assetStatus
    },
    {
      key: 12,
      label: 'Condition',
      children: asset.assetCondition
    },
    {
      key: 12,
      label: 'Notes',
      children: (
        <>{asset.notes?.map((note, index) => <p key={index}>{note}</p>)}</>
      )
    }
  ];

  return (
    <Descriptions
      size="small"
      title={asset.name}
      items={items}
      bordered
      column={1}
    />
  );
};

export default AssetDisplay;
