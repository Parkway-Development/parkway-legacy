import { Alert, Button, Empty, Spin, Table } from 'antd';
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
import useColumns, {
  DeleteAction,
  OrderedColumnsType
} from '../../hooks/useColumns.tsx';
import { IsBaseEntityApi } from '../../api';
import useResponsive from '../../hooks/useResponsive.ts';
import ResponsiveTable, { ResponsiveTableProps } from './ResponsiveTable.tsx';

type BaseDataTablePageProps<T extends BaseEntity> =
  BaseDataTableListProps<T> & {
    title?: string;
    addLink?: To;
    addLinkTitle?: string;
  };

type BaseDataTableListProps<T extends BaseEntity> = Pick<
  ResponsiveTableProps<T>,
  'responsiveCardRenderer'
> & {
  queryFn: () => TypedResponse<T[]>;
  queryKey: any[];
  columns: OrderedColumnsType<T>;
};

export const BaseDataTablePage = <T extends BaseEntity>({
  title,
  addLink,
  addLinkTitle,
  ...listProps
}: BaseDataTablePageProps<T>) => {
  return (
    <>
      {title && <h2>{title}</h2>}
      {addLink && (
        <nav className={styles.nav}>
          <Link to={addLink}>
            <Button type="primary">
              {addLinkTitle ?? (title ? `Add ${title.slice(0, -1)}` : 'Add')}
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
  columns,
  responsiveCardRenderer
}: BaseDataTableListProps<T>) => {
  const { aboveBreakpoint } = useResponsive();
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

  const content = aboveBreakpoint ? (
    <Table
      dataSource={data}
      columns={columns}
      rowKey={(record: T) => record._id}
      size="small"
      bordered
      scroll={{ x: 'auto' }}
    />
  ) : (
    <ResponsiveTable
      data={data}
      rowKey={(record: T) => record._id}
      responsiveCardRenderer={responsiveCardRenderer}
    />
  );

  return (
    <div className={styles.dataContainer}>
      <p>Total Count: {data.length}</p>
      {content}
    </div>
  );
};

type BaseApiDataTablePageProps<
  T extends BaseEntity,
  TBaseApiKey extends keyof BaseApiTypes
> = Pick<
  BaseDataTablePageProps<T>,
  'title' | 'addLinkTitle' | 'responsiveCardRenderer'
> & {
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

  const deleteAction: DeleteAction = { deleteFn, handleDelete };

  const { columns } = useColumns({
    columns: columnsProp,
    columnType: `${queryKeyProp}Page`,
    deleteAction,
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
