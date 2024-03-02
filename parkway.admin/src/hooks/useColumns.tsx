import { GenericResponse } from './useApi.ts';
import { BaseEntity } from '../types/BaseEntity.ts';
import { Link, To } from 'react-router-dom';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import { ReactNode, useRef, useState } from 'react';
import { EditOutlined, TableOutlined } from '@ant-design/icons';
import DeleteButton from '../components/delete-button/DeleteButton.tsx';
import styles from '../components/base-data-table-page/BaseDataTablePage.module.css';
import { Checkbox, Modal, ModalFuncProps } from 'antd';
import * as React from 'react';

type DeleteAction = {
  deleteFn: (id: string) => GenericResponse;
  handleDelete: () => void;
};

type UseColumnOptions<T extends BaseEntity> = {
  columns: ColumnsType<T>;
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
}: BuildActionsColumnOptions<T>): ColumnType<T> | undefined => {
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

  const itemWidth = 50;
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
      <div className={styles.actionsColumn}>{buildNodes(value)}</div>
    ),
    width,
    align: 'center',
    key: '__actions'
  };
};

export const useColumns = <T extends BaseEntity>({
  columns: propColumns,
  ...buildActionsColumnProp
}: UseColumnOptions<T>) => {
  const [modal, contextHolder] = Modal.useModal();
  const tempColumnsRef = useRef<ColumnsType<T>>([]);
  const previousColumnsRef = useRef<ColumnsType<T>>([]);

  const handleColumnConfigClick = () => {
    console.log(
      'building columns config with ref value of',
      tempColumnsRef.current
    );
    const config: ModalFuncProps = {
      title: 'Column Configuration',
      icon: null,
      content: (
        <div>
          {tempColumnsRef.current
            .filter(({ key }) => key !== '__actions')
            .map(({ title, hidden, key }) => (
              <div key={key}>
                <Checkbox
                  defaultChecked={hidden === undefined || !hidden}
                  onChange={(e) => {
                    tempColumnsRef.current = tempColumnsRef.current.map((c) =>
                      c.key === key ? { ...c, hidden: !e.target.checked } : c
                    );
                  }}
                >
                  {title?.toString()}
                </Checkbox>
              </div>
            ))}
        </div>
      ),
      onOk: () => {
        setColumns(tempColumnsRef.current);
      },
      okCancel: true,
      cancelText: 'Cancel',
      onCancel: () => {
        tempColumnsRef.current = previousColumnsRef.current;
      }
    };

    previousColumnsRef.current = tempColumnsRef.current;
    modal.info(config);
  };

  const [columns, setColumns] = useState<ColumnsType<T>>(() => {
    const actionsColumn = buildActionsColumn({
      ...buildActionsColumnProp,
      onColumnConfigClick: handleColumnConfigClick,
      contextHolder
    });

    const finalColumns = actionsColumn
      ? [actionsColumn, ...propColumns]
      : propColumns;

    tempColumnsRef.current = finalColumns;

    return finalColumns;
  });

  return {
    columns
  };
};

export default useColumns;
