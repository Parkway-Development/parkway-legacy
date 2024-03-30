import { Card } from 'antd';
import styles from './ResponsiveTable.module.css';
import { ReactNode } from 'react';
import { BaseEntity } from '../../types';

export type ResponsiveTableProps<T extends BaseEntity> = {
  data: T[];
  rowKey: (record: T) => string;
  responsiveCardRenderer: (item: T) => ReactNode;
};

const ResponsiveTable = <T extends BaseEntity>({
  data,
  rowKey,
  responsiveCardRenderer
}: ResponsiveTableProps<T>) => {
  return (
    <div className={styles.container}>
      {data.map((item) => (
        <Card key={rowKey(item)} className={styles.card}>
          {responsiveCardRenderer(item)}
        </Card>
      ))}
    </div>
  );
};

export default ResponsiveTable;
