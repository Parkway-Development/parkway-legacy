import { BaseEntity } from '../../types';
import useApi, {
  BaseApiTypes,
  buildQueryKey,
  QueryType
} from '../../hooks/useApi.ts';
import { IsBaseEntityApi } from '../../api';
import { useQuery } from '@tanstack/react-query';
import { Alert, SelectProps } from 'antd';
import BaseSelect, {
  MultipleSelectionProps,
  SingleSelectionProps
} from './BaseSelect.tsx';

export type ExportedBaseEntitySelectProps =
  | Pick<SingleSelectionProps, 'isMultiSelect' | 'value' | 'onChange'>
  | Pick<MultipleSelectionProps, 'isMultiSelect' | 'value' | 'onChange'>;

type BaseEntitySelectProps<
  T extends BaseEntity,
  TBaseApiKey extends keyof BaseApiTypes
> = ExportedBaseEntitySelectProps & {
  queryKey: QueryType;
  baseApiType: TBaseApiKey;
  renderer: (value: T) => string;
};

const BaseEntitySelect = <
  T extends BaseEntity,
  TBaseApiKey extends keyof BaseApiTypes
>({
  queryKey: queryKeyProp,
  baseApiType,
  renderer,
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
      options = data.map((profile) => ({
        value: profile._id,
        label: renderer(profile)
      }));
    }
  }

  return <BaseSelect {...props} loading={isPending} options={options} />;
};

export default BaseEntitySelect;
