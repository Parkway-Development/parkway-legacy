import { BaseEntity } from '../../types/BaseEntity.ts';
import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './ColumnConfigurationModal.module.css';
import { Button, ModalFuncProps, Switch } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';

type ColumnConfigurationModal<T extends BaseEntity> = {
  columns: React.MutableRefObject<OrderedColumnsType<T>>;
};

const ColumnConfigurationModal = <T extends BaseEntity>({
  columns: columnsProp
}: ColumnConfigurationModal<T>) => {
  const [columns, setColumns] = useState<OrderedColumnsType<T>>(
    columnsProp.current
  );

  const maxDisplayOrder = columns.reduce(
    (prev, { displayOrder }) => (displayOrder > prev ? displayOrder : prev),
    0
  );

  useEffect(() => {
    columnsProp.current = columns;
  }, [columns]);

  const handleSwitchToggle = (key: string) => (toggled: boolean) => {
    setColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, hidden: !toggled } : c))
    );
  };

  const handleMove =
    (displayOrder: number, key: string, moveUp: boolean) => () => {
      const positionDifference = moveUp ? -1 : 1;
      const otherIndex = columns.find(
        (other) => other.displayOrder === displayOrder + positionDifference
      );

      if (!otherIndex) {
        return;
      }

      setColumns((prev) =>
        prev.map((c) => {
          if (c.key === key) {
            return { ...c, displayOrder: displayOrder + positionDifference };
          } else if (c.key === otherIndex.key) {
            return { ...c, displayOrder };
          } else {
            return c;
          }
        })
      );
    };

  const handleShowHideClick = (show: boolean) => () => {
    setColumns((prev) =>
      prev.map((c) => (c.key === '__actions' ? c : { ...c, hidden: !show }))
    );
  };

  return (
    <div className={styles.columnConfigList}>
      <div className={styles.columnConfigListOptions}>
        <Button onClick={handleShowHideClick(true)}>Show All</Button>
        <Button onClick={handleShowHideClick(false)}>Hide All</Button>
      </div>
      {columns
        .filter(({ key }) => key !== '__actions')
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(({ title, hidden, key, displayOrder }) => (
          <div key={key}>
            <Button
              disabled={displayOrder >= maxDisplayOrder}
              onClick={handleMove(displayOrder, key, false)}
              size="small"
            >
              <ArrowDownOutlined />
            </Button>
            <Button
              disabled={displayOrder <= 1}
              onClick={handleMove(displayOrder, key, true)}
              size="small"
            >
              <ArrowUpOutlined />
            </Button>
            <Switch
              checked={hidden === undefined || !hidden}
              onClick={handleSwitchToggle(key)}
            />
            <span>{title?.toString()}</span>
          </div>
        ))}
    </div>
  );
};

export const modalProps: ModalFuncProps = {
  title: 'Column Configuration',
  icon: null,
  style: { top: '2em' },
  okCancel: true
};

export default ColumnConfigurationModal;
