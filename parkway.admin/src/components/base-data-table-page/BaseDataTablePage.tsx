import { Alert, Button, Empty, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import styles from './BaseDataTablePage.module.css';
import { Link, To } from 'react-router-dom';
import useApi, {
  BaseApiTypes,
  buildQueryKey,
  QueryType,
  TypedResponse
} from '../../hooks/useApi.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BaseEntity } from '../../types';
import useColumns, { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import { IsBaseEntityApi } from '../../api';

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

export const BaseDataTablePage = <T extends BaseEntity>({
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
        rowKey={(record: T) => record._id}
        size="small"
        bordered
        scroll={{ x: 'auto' }}
      />
    </div>
  );
};

type BaseApiDataTablePageProps<
  T extends BaseEntity,
  TBaseApiKey extends keyof BaseApiTypes
> = Pick<BaseDataTablePageProps<T>, 'title' | 'addLinkTitle'> & {
  queryKey: QueryType;
  columns: OrderedColumnsType<T>;
  baseApiType: TBaseApiKey;
};

export const BaseApiDataTablePage = <
  T extends BaseEntity,
  TBaseApiKey extends keyof BaseApiTypes
>({
  queryKey: queryKeyProp,
  columns: columnsProp,
  baseApiType,
  ...props
}: BaseApiDataTablePageProps<T, TBaseApiKey>) => {
  const queryClient = useQueryClient();
  const queryKey = buildQueryKey(queryKeyProp);
  const apiResult = useApi();
  const baseApiEntity = apiResult[baseApiType];

  if (!IsBaseEntityApi<T>(baseApiEntity)) {
    throw new Error(
      `${baseApiEntity} is not compatible with this table component, use BaseDataTablePage component instead`
    );
  }

  const { delete: deleteFn, getAll } = baseApiEntity;

  const handleDelete = () => {
    queryClient.invalidateQueries({
      queryKey
    });
  };

  const { columns } = useColumns({
    columns: columnsProp,
    columnType: `${queryKeyProp}Page`,
    deleteAction: { deleteFn, handleDelete },
    editLink: ({ _id }) => `./${_id}/edit`
  });

  return (
    <BaseDataTablePage<T>
      addLink={`./add`}
      queryFn={getAll}
      queryKey={queryKey}
      columns={columns}
      {...props}
    />
  );
};
