import { Alert, notification, Spin } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { BaseEntity } from '../../types';
import { BaseApiType, IsBaseEntityApi } from '../../api';
import { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { trimStrings } from '../../utilities';
import { SharedBasePageProps } from './types.ts';

export interface EditBaseApiFormProps<T extends BaseEntity> {
  isSaving: boolean;
  onSave: (values: Omit<T, '_id'>) => void;
  onCancel: () => void;
  initialValues: Omit<T, '_id'>;
}

type EditBaseApiEntityPageProps<T extends BaseEntity> = SharedBasePageProps & {
  editForm: (props: EditBaseApiFormProps<T>) => ReactNode;
};

const buildQueryFn = <T extends BaseEntity>(
  baseApi: BaseApiType<T>,
  id: string
) => {
  return baseApi.getById(id);
};

const EditBaseApiEntityPage = <T extends BaseEntity>({
  queryKey: queryKeyProp,
  baseApiType,
  editForm: EditForm,
  mainPage
}: EditBaseApiEntityPageProps<T>) => {
  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();
  const { formatError, ...apiResult } = useApi();
  const baseApiEntity = apiResult[baseApiType];
  const navigate = useNavigate();

  if (!IsBaseEntityApi<T>(baseApiEntity)) {
    throw new Error(
      `${baseApiEntity} is not compatible with this base api component`
    );
  }

  const { update } = baseApiEntity;

  const queryFn = buildQueryFn(baseApiEntity, id ?? 'undefined');

  const { isPending, mutate } = useMutation({
    mutationFn: update
  });

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

  const [api, contextHolder] = notification.useNotification();

  if (!id) {
    return <Alert type="error" message="Invalid id" />;
  }

  if (error) {
    return <Alert type="error" message={formatError(error)} />;
  }

  if (isLoading || !response?.data) {
    return <Spin />;
  }

  const initialValues: Omit<T, '_id'> = {
    ...response.data
  };

  const handleUpdate = (payload: Omit<T, '_id'>) => {
    const newPayload = trimStrings(payload) as T;

    mutate(
      { ...newPayload, _id: id },
      {
        onSuccess: ({ data }: { data: T }) => {
          queryClient.setQueryData(buildQueryKey(queryKeyProp, data._id), data);
          navigate(mainPage);
        },
        onError: (error: Error | null) =>
          api.error({
            message: formatError(error)
          })
      }
    );
  };

  const handleCancel = () => navigate(mainPage);

  return (
    <>
      {contextHolder}
      <EditForm
        onCancel={handleCancel}
        isSaving={isPending}
        onSave={handleUpdate}
        initialValues={initialValues}
      />
    </>
  );
};

export { EditBaseApiEntityPage };
