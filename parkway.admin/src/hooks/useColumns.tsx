import { GenericResponse } from './useApi.ts';
import { BaseEntity } from '../types';
import { Link, To } from 'react-router-dom';
import { ColumnType } from 'antd/lib/table';
import { ReactNode, useRef, useState } from 'react';
import { EditOutlined, TableOutlined } from '@ant-design/icons';
import DeleteButton from '../components/delete-button';
import styles from './useColumns.module.css';
import { Modal, ModalFuncProps } from 'antd';
import * as React from 'react';
import { useLocalStorage } from './useLocalStorage.ts';
import ColumnConfigurationModal, {
  modalProps
} from '../components/column-configuration-modal';

type LocalStorageColumnsType = {
  key: string;
  displayOrder: number;
  hidden: boolean;
};

type OrderedColumnType<T extends BaseEntity> = ColumnType<T> & {
  displayOrder: number;
  dataIndex?: keyof T;
  key: string;
};

export type OrderedColumnsType<T extends BaseEntity> = OrderedColumnType<T>[];

type DeleteAction = {
  deleteFn: (id: string) => GenericResponse;
  handleDelete: () => void;
};

type UseColumnOptions<T extends BaseEntity> = {
  columns: OrderedColumnsType<T>;
  columnType: string;
  deleteAction?: DeleteAction;
  editLink?: (value: T) => To;
};

type BuildActionsColumnOptions<T extends BaseEntity> = Omit<
  UseColumnOptions<T>,
  'columns' | 'columnType'
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

export const useColumns = <T extends BaseEntity>({
  columns: propColumns,
  columnType,
  ...buildActionsColumnProp
}: UseColumnOptions<T>) => {
  const [modal, contextHolder] = Modal.useModal();
  const [storedValue, setValue] = useLocalStorage<LocalStorageColumnsType[]>(
    `columnConfiguration:${columnType}`,
    undefined
  );
  const tempColumnsRef = useRef<OrderedColumnsType<T>>([]);
  const previousColumnsRef = useRef<OrderedColumnsType<T>>([]);

  const handleColumnConfigClick = () => {
    const handleOkClick = () => {
      const newColumns = tempColumnsRef.current.sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
      setColumns(newColumns);

      const localStorageColumns: LocalStorageColumnsType[] = newColumns.map(
        ({ key, displayOrder, hidden }) => ({
          key,
          displayOrder,
          hidden: hidden === true
        })
      );

      setValue(localStorageColumns);
    };

    const handleCancelClick = () => {
      tempColumnsRef.current = previousColumnsRef.current;
    };

    const config: ModalFuncProps = {
      ...modalProps,
      content: <ColumnConfigurationModal<T> columns={tempColumnsRef} />,
      onOk: handleOkClick,
      onCancel: handleCancelClick
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

    // Apply saved values if found
    if (storedValue?.length) {
      finalColumns = finalColumns.map((c) => {
        const configuredColumn = storedValue.find((x) => x.key === c.key);
        if (configuredColumn) {
          return {
            ...c,
            displayOrder: configuredColumn.displayOrder,
            hidden: configuredColumn.hidden
          };
        }

        return c;
      });
    }

    finalColumns = finalColumns.sort((a, b) => a.displayOrder - b.displayOrder);
    tempColumnsRef.current = finalColumns;

    return finalColumns;
  });

  return {
    columns
  };
};

export default useColumns;
