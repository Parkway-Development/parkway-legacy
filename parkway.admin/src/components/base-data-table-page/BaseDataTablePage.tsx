import { Alert, Button, Empty, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import styles from './BaseDataTablePage.module.css';
import { Link, To } from 'react-router-dom';
import useApi, { GenericResponse, TypedResponse } from '../../hooks/useApi.ts';
import { useQuery } from '@tanstack/react-query';
import { BaseEntity } from '../../types/BaseEntity.ts';
import DeleteButton from '../delete-button/DeleteButton.tsx';
import { ColumnType } from 'antd/lib/table';

type BaseDataTablePageProps<T extends BaseEntity> =
  BaseDataTableListProps<T> & {
    title: string;
    addLink?: To;
  };

type BaseDataTableListProps<T extends BaseEntity> = {
  queryFn: () => TypedResponse<T[]>;
  queryKey: any[];
  columns: ColumnsType<T>;
};

export const buildDeleteColumn = <T extends BaseEntity>(
  deleteFn: (id: string) => GenericResponse,
  handleDelete: () => void
): ColumnType<T> => {
  return {
    title: 'Delete',
    render: (value: T) => (
      <DeleteButton
        id={value._id}
        deleteFn={deleteFn}
        onSuccess={handleDelete}
      />
    ),
    width: 50,
    align: 'center'
  };
};

const BaseDataTablePage = <T extends BaseEntity>({
  title,
  addLink,
  ...listProps
}: BaseDataTablePageProps<T>) => {
  return (
    <>
      <h2>{title}</h2>
      {addLink && (
        <nav className={styles.nav}>
          <Link to={addLink}>
            <Button type="primary">Add {title.slice(0, -1)}</Button>
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
