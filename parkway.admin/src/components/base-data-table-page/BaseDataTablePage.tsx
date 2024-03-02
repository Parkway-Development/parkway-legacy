import { Alert, Button, Empty, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import styles from './BaseDataTablePage.module.css';
import { Link, To } from 'react-router-dom';
import useApi, { GenericResponse, TypedResponse } from '../../hooks/useApi.ts';
import { useQuery } from '@tanstack/react-query';
import { BaseEntity } from '../../types/BaseEntity.ts';
import DeleteButton from '../delete-button/DeleteButton.tsx';
import { ColumnType } from 'antd/lib/table';
import { ReactNode } from 'react';
import { EditOutlined } from '@ant-design/icons';

type BaseDataTablePageProps<T extends BaseEntity> =
  BaseDataTableListProps<T> & {
    title: string;
    addLink?: To;
    addLinkTitle?: string;
  };

type BaseDataTableListProps<T extends BaseEntity> = {
  queryFn: () => TypedResponse<T[]>;
  queryKey: any[];
  columns: ColumnsType<T>;
};

type DeleteAction = {
  deleteFn: (id: string) => GenericResponse;
  handleDelete: () => void;
};

type BuildActionsColumnOptions<T extends BaseEntity> = {
  deleteAction?: DeleteAction;
  editLink?: (value: T) => To;
};

export const buildActionsColumn = <T extends BaseEntity>({
  deleteAction,
  editLink
}: BuildActionsColumnOptions<T>): ColumnType<T> => {
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

  return {
    render: (value: T) => (
      <div className={styles.actionsColumn}>{buildNodes(value)}</div>
    ),
    width,
    align: 'center'
  };
};

const BaseDataTablePage = <T extends BaseEntity>({
  title,
  addLink,
  addLinkTitle,
  ...listProps
}: BaseDataTablePageProps<T>) => {
  return (
    <>
      <h2>{title}</h2>
      {addLink && (
        <nav className={styles.nav}>
          <Link to={addLink}>
            <Button type="primary">
              {addLinkTitle ?? `Add ${title.slice(0, -1)}`}
            </Button>
          </Link>
        </nav>
      )}
      <BaseDataTableList<T> {...listProps} />
    </>
  );
};

const BaseDataTableList = <T extends BaseEntity>({
  queryFn,
  queryKey,
  columns
}: BaseDataTableListProps<T>) => {
  const { formatError } = useApi();
  const {
    isPending,
    error,
    data: response
  } = useQuery({
    queryFn,
    queryKey
  });

  if (error) {
    return <Alert type="error" message={formatError(error)} />;
  }

  if (isPending) {
    return <Spin />;
  }

  if (!response?.data?.length) {
    return <Empty />;
  }

  const { data } = response;

  return (
    <div className={styles.dataContainer}>
      <p>Total Count: {data.length}</p>
      <Table
        dataSource={data}
        columns={columns}
        rowKey={(record) => record._id}
        size="small"
        bordered
      />
    </div>
  );
};

export default BaseDataTablePage;
