import { Card } from 'antd';
import styles from './ResponsiveTable.module.css';
import { ReactNode } from 'react';
import { BaseEntity } from '../../types';
import { useNavigate } from 'react-router-dom';

export interface ResponsiveTableProps<T extends BaseEntity> {
  data: T[];
  rowKey: (record: T) => string;
  responsiveCardRenderer: (item: T) => ReactNode;
}

const ResponsiveTable = <T extends BaseEntity>({
  data,
  rowKey,
  responsiveCardRenderer
}: ResponsiveTableProps<T>) => {
  const navigate = useNavigate();
  const handleClick = (id: string) => {
    navigate(`./${id}`);
  };

  return (
    <div className={styles.container}>
      {data.map((item) => (
        <Card
          key={rowKey(item)}
          className={styles.card}
          onClick={() => handleClick(item._id)}
        >
          {responsiveCardRenderer(item)}
        </Card>
      ))}
    </div>
  );
};

export default ResponsiveTable;
