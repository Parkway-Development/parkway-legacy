import { Location } from '../../types';
import { Card, Descriptions, DescriptionsProps } from 'antd';
import styles from './LocationDisplay.module.scss';

const LocationDisplay = (location: Location) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Description',
      children: location.description
    }
  ];

  const { address } = location;

  return (
    <>
      <h3>{location.name}</h3>
      <Descriptions
        size="small"
        items={items}
        bordered
        column={1}
        className={styles.descriptions}
      />
      <Card title="Address" className={styles.card}>
        {address ? (
          <>
            <p>{address.streetAddress1}</p>
            {address.streetAddress2 && <p>{address.streetAddress2}</p>}
            <p>
              {address.city}, {address.state} {address.zip}
            </p>
          </>
        ) : (
          'Not on file'
        )}
      </Card>
    </>
  );
};

export default LocationDisplay;
