import { Vendor } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';

const VendorDisplay = (vendor: Vendor) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Address',
      children: vendor.address
    },
    {
      key: 2,
      label: 'City',
      children: vendor.city
    },
    {
      key: 3,
      label: 'State',
      children: vendor.state
    },
    {
      key: 4,
      label: 'Zip',
      children: vendor.zip
    },
    {
      key: 5,
      label: 'Phone',
      children: vendor.phone
    },
    {
      key: 6,
      label: 'Email',
      children: vendor.email
    },
    {
      key: 7,
      label: 'Website',
      children: vendor.website
    },
    {
      key: 8,
      label: 'Contact',
      children: vendor.contact
    },
    {
      key: 9,
      label: 'Contact Phone',
      children: vendor.contactPhone
    },
    {
      key: 10,
      label: 'Contact Email',
      children: vendor.contactEmail
    },
    {
      key: 11,
      label: 'Notes',
      children: vendor.notes
    }
  ];

  return (
    <>
      <Descriptions
        size="small"
        title={vendor.name}
        items={items}
        bordered
        column={1}
      />
    </>
  );
};

export default VendorDisplay;
