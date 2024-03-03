import { GenericResponse } from './useApi.ts';
import { BaseEntity } from '../types/BaseEntity.ts';
import { Link, To } from 'react-router-dom';
import { ColumnType } from 'antd/lib/table';
import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EditOutlined,
  TableOutlined
} from '@ant-design/icons';
import DeleteButton from '../components/delete-button/DeleteButton.tsx';
import styles from './useColumns.module.css';
import { Button, Modal, ModalFuncProps, Switch } from 'antd';
import * as React from 'react';

type OrderedColumnType<T extends BaseEntity> = ColumnType<T> & {
  displayOrder: number;
};

export type OrderedColumnsType<T extends BaseEntity> = OrderedColumnType<T>[];

type DeleteAction = {
  deleteFn: (id: string) => GenericResponse;
  handleDelete: () => void;
};

type UseColumnOptions<T extends BaseEntity> = {
  columns: OrderedColumnsType<T>;
  deleteAction?: DeleteAction;
  editLink?: (value: T) => To;
};

type BuildActionsColumnOptions<T extends BaseEntity> = Omit<
  UseColumnOptions<T>,
  'columns'
> & {
  onColumnConfigClick: () => void;
  contextHolder: React.ReactElement;
};

const buildActionsColumn = <T extends BaseEntity>({
  deleteAction,
  editLink,
  onColumnConfigClick,
  contextHolder
}: BuildActionsColumnOptions<T>): OrderedColumnType<T> | undefined => {
  const buildNodes = (value: T) => {
    const nodes: ReactNode[] = [];

    if (editLink) {
      nodes.push(
        <Link to={editLink(value)} key="edit">
          <EditOutlined />
        </Link>
      );
    }

    if (deleteAction) {
      nodes.push(
        <DeleteButton
          key="delete"
          id={value._id}
          deleteFn={deleteAction.deleteFn}
          onSuccess={deleteAction.handleDelete}
        />
      );
    }

    return nodes;
  };

  const itemWidth = 30;
  let width = 0;
  if (editLink) width += itemWidth;
  if (deleteAction) width += itemWidth;

  if (width === 0) return undefined;

  return {
    title: (
      <>
        <TableOutlined
          style={{ fontSize: '20px' }}
          onClick={onColumnConfigClick}
        />
        {contextHolder}
      </>
    ),
    render: (value: T) => (
      <div
        className={styles.actionsColumn}
        style={{ minWidth: width, maxWidth: width }}
      >
        {buildNodes(value)}
      </div>
    ),
    width,
    fixed: 'left',
    align: 'center',
    key: '__actions',
    displayOrder: 0
  };
};

const ModalContent = <T extends BaseEntity>({
  columns: columnsProp
}: {
  columns: React.MutableRefObject<OrderedColumnsType<T>>;
}) => {
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

  const handleSwitchToggle =
    (key: React.Key | undefined) => (toggled: boolean) => {
      setColumns((prev) =>
        prev.map((c) => (c.key === key ? { ...c, hidden: !toggled } : c))
      );
    };

  const handleMove =
    (displayOrder: number, key: React.Key | undefined, moveUp: boolean) =>
    () => {
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

  return (
    <div className={styles.columnConfigList}>
      {columns
        .filter(({ key }) => key && key !== '__actions')
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

export const useColumns = <T extends BaseEntity>({
  columns: propColumns,
  ...buildActionsColumnProp
}: UseColumnOptions<T>) => {
  const [modal, contextHolder] = Modal.useModal();
  const tempColumnsRef = useRef<OrderedColumnsType<T>>([]);
  const previousColumnsRef = useRef<OrderedColumnsType<T>>([]);

  const handleColumnConfigClick = () => {
    const config: ModalFuncProps = {
      title: 'Column Configuration',
      icon: null,
      content: <ModalContent<T> columns={tempColumnsRef} />,
      onOk: () => {
        setColumns(
          tempColumnsRef.current.sort((a, b) => a.displayOrder - b.displayOrder)
        );
      },
      okCancel: true,
      cancelText: 'Cancel',
      onCancel: () => {
        tempColumnsRef.current = previousColumnsRef.current;
      },
      style: { top: '2em' }
    };

    previousColumnsRef.current = tempColumnsRef.current;
    void modal.info(config);
  };

  const [columns, setColumns] = useState<OrderedColumnsType<T>>(() => {
    const actionsColumn = buildActionsColumn({
      ...buildActionsColumnProp,
      onColumnConfigClick: handleColumnConfigClick,
      contextHolder
    });

    let finalColumns = actionsColumn
      ? [actionsColumn, ...propColumns]
      : propColumns;

    finalColumns = finalColumns.sort((a, b) => a.displayOrder - b.displayOrder);
    tempColumnsRef.current = finalColumns;

    return finalColumns;
  });

  return {
    columns
  };
};

export default useColumns;
