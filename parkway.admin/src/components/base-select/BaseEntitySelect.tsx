import { BaseEntity } from '../../types';
import useApi, {
  BaseApiTypes,
  buildQueryKey,
  QueryType
} from '../../hooks/useApi.ts';
import { IsBaseEntityApi } from '../../api';
import { useQuery } from '@tanstack/react-query';
import { Alert, SelectProps, Spin } from 'antd';
import {
  BaseSelect,
  MultipleSelectionProps,
  SingleSelectionProps
} from './BaseSelect.tsx';

export type ExportedBaseEntitySelectProps = (
  | SingleSelectionProps
  | MultipleSelectionProps
) & {
  enabledIds?: string[];
  excludedIds?: string[];
};

type BaseEntitySelectProps<
  T extends BaseEntity,
  TBaseApiKey extends keyof BaseApiTypes
> = ExportedBaseEntitySelectProps & {
  queryKey: QueryType;
  baseApiType: TBaseApiKey;
  renderer: (value: T) => string;
};

export const BaseEntitySelect = <
  T extends BaseEntity,
  TBaseApiKey extends keyof BaseApiTypes
>({
  queryKey: queryKeyProp,
  baseApiType,
  renderer,
  enabledIds,
  excludedIds,
  ...props
}: BaseEntitySelectProps<T, TBaseApiKey>) => {
  const queryKey = buildQueryKey(queryKeyProp);
  const { formatError, ...apiResult } = useApi();
  const baseApiEntity = apiResult[baseApiType];

  if (!IsBaseEntityApi<T>(baseApiEntity)) {
    throw new Error(
      `${baseApiEntity} is not compatible with this select component`
    );
  }

  const { getAll } = baseApiEntity;

  const {
    isPending,
    error,
    data: response
  } = useQuery({
    queryFn: getAll,
    queryKey
  });

  if (error) {
    return <Alert type="error" message={formatError(error)} />;
  }

  let options: SelectProps['options'] = [];

  if (response) {
    const { data } = response;

    if (data.length) {
      options = data
        .filter(
          (baseEntity) => !excludedIds || !excludedIds.includes(baseEntity._id)
        )
        .map((baseEntity) => ({
          value: baseEntity._id,
          label: renderer(baseEntity),
          disabled:
            !enabledIds || enabledIds.includes(baseEntity._id)
              ? undefined
              : true
        }));
    }
  }

  if (isPending || props.loading) {
    return <Spin size="small" />;
  }

  return <BaseSelect {...props} options={options} />;
};
