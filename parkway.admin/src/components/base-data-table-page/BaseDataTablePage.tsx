import { Alert, Button, Empty, Spin, Table } from 'antd';
import styles from './BaseDataTablePage.module.css';
import { Link, To } from 'react-router-dom';
import useApi, { buildQueryKey, TypedResponse } from '../../hooks/useApi.tsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BaseEntity } from '../../types';
import useColumns, {
  DeleteAction,
  OrderedColumnsType
} from '../../hooks/useColumns.tsx';
import { IsBaseEntityApi } from '../../api';
import useResponsive from '../../hooks/useResponsive.ts';
import ResponsiveTable, { ResponsiveTableProps } from './ResponsiveTable.tsx';
import { SharedBasePageProps } from './types.ts';

type BaseDataTablePageProps<T extends BaseEntity> =
  BaseDataTableListProps<T> & {
    title?: string;
    subtitle?: string;
    addLink?: To;
    addLinkTitle?: string;
  };

type BaseDataTableListProps<T extends BaseEntity> = Pick<
  ResponsiveTableProps<T>,
  'responsiveCardRenderer'
> & {
  queryFn: () => TypedResponse<T[]>;
  queryKey: unknown[];
  columns: OrderedColumnsType<T>;
  skipPagination?: boolean;
};

export const BaseDataTablePage = <T extends BaseEntity>({
  title,
  subtitle,
  addLink,
  addLinkTitle,
  ...listProps
}: BaseDataTablePageProps<T>) => {
  return (
    <>
      {title && <h2>{title}</h2>}
      {subtitle && <p>{subtitle}</p>}
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
  responsiveCardRenderer,
  skipPagination
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
      pagination={skipPagination ? false : undefined}
      scroll={{ x: 'auto' }}
      expandable={{
        expandIcon: () => null,
        expandRowByClick: false
      }}
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

type BaseApiDataTablePageProps<T extends BaseEntity> = SharedBasePageProps &
  Pick<
    BaseDataTablePageProps<T>,
    | 'title'
    | 'subtitle'
    | 'addLinkTitle'
    | 'responsiveCardRenderer'
    | 'skipPagination'
  > & {
    columns: OrderedColumnsType<T>;
    allowAdd?: boolean;
    allowDelete?: boolean;
    allowEdit?: boolean;
  };

export const BaseApiDataTablePage = <T extends BaseEntity>({
  queryKey: queryKeyProp,
  columns: columnsProp,
  baseApiType,
  allowAdd = true,
  allowEdit = true,
  allowDelete = true,
  ...props
}: BaseApiDataTablePageProps<T>) => {
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
    deleteAction: allowDelete ? deleteAction : undefined,
    editLink: allowEdit ? ({ _id }) => `./${_id}/edit` : undefined
  });

  return (
    <BaseDataTablePage<T>
      addLink={allowAdd ? `./add` : undefined}
      queryFn={getAll}
      queryKey={queryKey}
      columns={columns}
      {...props}
    />
  );
};
