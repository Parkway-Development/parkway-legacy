import { Alert, Button, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { BaseEntity } from '../../types';
import { BaseApiType, IsBaseEntityApi } from '../../api';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { ReactNode } from 'react';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import styles from './BaseDisplayPage.module.css';
import DeleteButton from '../delete-button';

type BaseDisplayPageProps<T extends BaseEntity> = SharedBasePageProps & {
  render: (item: T) => ReactNode;
};

const buildQueryFn = <T extends BaseEntity>(
  baseApi: BaseApiType<T>,
  id: string
) => {
  return baseApi.getById(id);
};

const BaseDisplayPage = <T extends BaseEntity>({
  queryKey: queryKeyProp,
  baseApiType,
  mainPage,
  render
}: BaseDisplayPageProps<T>) => {
  const params = useParams();
  const id = params.id;
  const { formatError, ...apiResult } = useApi();
  const baseApiEntity = apiResult[baseApiType];
  const navigate = useNavigate();

  if (!IsBaseEntityApi<T>(baseApiEntity)) {
    throw new Error(
      `${baseApiEntity} is not compatible with this base api component`
    );
  }

  const queryFn = buildQueryFn(baseApiEntity, id ?? 'undefined');
  const { delete: deletefn } = baseApiEntity;

  const {
    isPending: isLoading,
    data: response,
    error
  } = useQuery<
    Omit<AxiosResponse<T, unknown>, 'config'>,
    Error,
    Omit<AxiosResponse<T, unknown>, 'config'>,
    unknown[]
  >({
    queryFn,
    queryKey: buildQueryKey(queryKeyProp, id)
  });

  if (!id) {
    return <Alert type="error" message="Invalid id" />;
  }

  if (error) {
    return <Alert type="error" message={formatError(error)} />;
  }

  if (isLoading || !response?.data) {
    return <Spin />;
  }

  const handleCancel = () => navigate(mainPage);

  const handleEdit = () => navigate('./edit');

  return (
    <>
      <div className={styles.header}>
        <Button onClick={handleCancel} type="primary">
          Close
        </Button>
        <Button onClick={handleEdit}>Edit</Button>
        <DeleteButton
          id={id}
          deleteFn={deletefn}
          isIconButton={false}
          onSuccess={handleCancel}
        />
      </div>
      {render(response.data)}
    </>
  );
};

export { BaseDisplayPage };
