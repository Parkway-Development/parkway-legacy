import { Alert, Button, Empty, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import styles from './BaseDataTablePage.module.css';
import { Link, To } from 'react-router-dom';
import useApi, {
  ApiType,
  BaseApiTypes,
  buildQueryKey,
  TypedResponse
} from '../../hooks/useApi.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BaseEntity } from '../../types/BaseEntity.ts';
import useColumns, { OrderedColumnsType } from '../../hooks/useColumns.tsx';

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
        scroll={{ x: 'auto' }}
      />
    </div>
  );
};

type BaseApiDataTablePageProps<
  T extends BaseEntity,
  TBaseApi extends keyof ApiType
> = Pick<BaseDataTablePageProps<T>, 'title'> & {
  queryKey: 'accounts' | 'teams' | 'profiles';
  columns: OrderedColumnsType<T>;
  baseApi: TBaseApi;
};

export const BaseApiDataTablePage = <
  T extends BaseEntity,
  TBaseApi extends keyof BaseApiTypes
>({
  queryKey: queryKeyProp,
  columns: columnsProp,
  baseApi,
  title
}: BaseApiDataTablePageProps<T, TBaseApi>) => {
  const queryClient = useQueryClient();
  const queryKey = buildQueryKey(queryKeyProp);
  const apiResult = useApi();
  const stuff = apiResult[baseApi];

  const { delete: deleteFn, getAll } = stuff;

  const handleDelete = () => {
    queryClient.invalidateQueries({
      queryKey
    });
  };

  const { columns } = useColumns({
    columns: columnsProp,
    columnType: `${queryKeyProp}Page`,
    deleteAction: { deleteFn, handleDelete },
    editLink: ({ _id }) => `/${queryKeyProp}/${_id}/edit`
  });

  // @ts-ignore
  const queryFn: () => TypedResponse<T[]> = getAll;

  return (
    <BaseDataTablePage<T>
      addLink={`/${queryKey}/add`}
      queryFn={queryFn}
      queryKey={queryKey}
      columns={columns}
      title={title}
    />
  );
};

export default BaseDataTablePage;
