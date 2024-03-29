import { Card } from 'antd';
import styles from './ResponsiveTable.module.css';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';

type ResponsiveTableProps<T> = {
  data: T[];
  columns: OrderedColumnsType<T>;
  rowKey: (record: T) => string;
};

const renderValue = <T,>(value: T[keyof T]) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return '';
};

const ResponsiveTable = <T,>({
  data,
  columns,
  rowKey
}: ResponsiveTableProps<T>) => {
  return (
    <div className={styles.container}>
      {data.map((item) => (
        <Card key={rowKey(item)} title={rowKey(item)} className={styles.card}>
          {columns
            .filter((column) => column.dataIndex !== undefined)
            .map((column, index) => {
              const value = item[column.dataIndex!];

              const finalValue = column.render
                ? column.render(value, item, index)
                : renderValue(value);

              if (
                finalValue === null ||
                finalValue === undefined ||
                (typeof finalValue === 'string' &&
                  finalValue.trim().length === 0)
              )
                return null;

              return (
                <div key={column.key} className={styles.dataRow}>
                  <span>{column.title}:</span>
                  <span>{finalValue}</span>
                </div>
              );
            })}
        </Card>
      ))}
    </div>
  );
};

export default ResponsiveTable;
