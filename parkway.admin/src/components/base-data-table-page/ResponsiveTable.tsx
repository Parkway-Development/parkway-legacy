import { Card } from 'antd';
import styles from './ResponsiveTable.module.css';
import { DeleteAction, OrderedColumnsType } from '../../hooks/useColumns.tsx';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { BaseEntity } from '../../types';
import DeleteButton from '../delete-button';

export type ResponsiveTableProps<T extends BaseEntity> = {
  data: T[];
  columns: OrderedColumnsType<T>;
  rowKey: (record: T) => string;
  cardTitleRenderFn: (item: T) => ReactNode;
  deleteAction: DeleteAction;
};

const renderValue = <T,>(value: T[keyof T]) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return '';
};

type CardTitleProps<T extends BaseEntity> = Pick<
  ResponsiveTableProps<T>,
  'cardTitleRenderFn' | 'deleteAction'
> & {
  item: T;
};

const CardTitle = <T extends BaseEntity>({
  item,
  cardTitleRenderFn,
  deleteAction
}: CardTitleProps<T>) => {
  return (
    <div className={styles.cardTitle}>
      <span>{cardTitleRenderFn(item)}</span>
      <Link to={`./${item._id}/edit`} key="edit">
        <EditOutlined />
      </Link>
      <DeleteButton
        key="delete"
        id={item._id}
        deleteFn={deleteAction.deleteFn}
        onSuccess={deleteAction.handleDelete}
      />
    </div>
  );
};

const ResponsiveTable = <T extends BaseEntity>({
  data,
  columns,
  rowKey,
  cardTitleRenderFn,
  deleteAction
}: ResponsiveTableProps<T>) => {
  return (
    <div className={styles.container}>
      {data.map((item) => (
        <Card
          key={rowKey(item)}
          title={
            <CardTitle
              item={item}
              cardTitleRenderFn={cardTitleRenderFn}
              deleteAction={deleteAction}
            />
          }
          className={styles.card}
        >
          {columns
            .filter(
              (column) =>
                !column.isPartOfCardTitle && column.dataIndex !== undefined
            )
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
