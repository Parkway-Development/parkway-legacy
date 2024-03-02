import { Alert, Button, Empty, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import styles from './BaseDataTablePage.module.css';
import { Link, To } from 'react-router-dom';
import useApi, { TypedResponse } from '../../hooks/useApi.ts';
import { useQuery } from '@tanstack/react-query';
import { BaseEntity } from '../../types/BaseEntity.ts';

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
