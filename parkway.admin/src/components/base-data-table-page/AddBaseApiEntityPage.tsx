import { notification } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi, {
  BaseApiTypes,
  buildQueryKey,
  QueryType
} from '../../hooks/useApi.ts';
import { BaseEntity } from '../../types';
import { IsBaseEntityApi } from '../../api/baseApi.ts';
import { ReactNode } from 'react';
import { To, useNavigate } from 'react-router-dom';
import { trimStrings } from '../../utilities';

export type AddBaseApiFormProps<T extends BaseEntity> = {
  isSaving: boolean;
  onSave: (values: Omit<T, '_id'>) => void;
  onCancel: () => void;
};

type AddBaseApiEntityPageProps<
  T extends BaseEntity,
  TBaseApiKey extends keyof BaseApiTypes
> = {
  queryKey: QueryType;
  baseApiType: TBaseApiKey;
  addForm: (props: AddBaseApiFormProps<T>) => ReactNode;
  mainPage: To;
};

const AddBaseApiEntityPage = <
  T extends BaseEntity,
  TBaseApi extends keyof BaseApiTypes
>({
  queryKey: queryKeyProp,
  baseApiType,
  addForm: AddForm,
  mainPage
}: AddBaseApiEntityPageProps<T, TBaseApi>) => {
  const queryClient = useQueryClient();
  const { formatError, ...apiResult } = useApi();
  const baseApiEntity = apiResult[baseApiType];
  const navigate = useNavigate();

  if (!IsBaseEntityApi<T>(baseApiEntity)) {
    throw new Error(
      `${baseApiEntity} is not compatible with this base api component`
    );
  }

  const { create } = baseApiEntity;

  const { isPending, mutate } = useMutation({
    mutationFn: create
  });

  const [api, contextHolder] = notification.useNotification();

  const handleAdd = (payload: Omit<T, '_id'>) => {
    const trimmedPayload = trimStrings(payload);

    mutate(trimmedPayload, {
      onSuccess: ({ data }: { data: T }) => {
        queryClient.setQueryData(buildQueryKey(queryKeyProp, data._id), data);
        navigate(mainPage);
      },
      onError: (error: Error | null) =>
        api.error({
          message: formatError(error)
        })
    });
  };

  const handleCancel = () => navigate(mainPage);

  return (
    <>
      {contextHolder}
      <AddForm
        isSaving={isPending}
        onSave={handleAdd}
        onCancel={handleCancel}
      />
    </>
  );
};

export { AddBaseApiEntityPage };
