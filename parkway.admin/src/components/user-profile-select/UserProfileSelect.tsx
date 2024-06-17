import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import { BaseSelect, BaseSelectionProps } from '../base-select';
import { DefaultOptionType } from 'antd/lib/select/index';

type UserProfileSelectProps<T> = Omit<BaseSelectionProps<T>, 'value'> & {
  excludedUserId?: string;
  initialValue?: T;
};

const UserProfileSelect = <T,>({
  onChange,
  excludedUserId,
  initialValue,
  ...props
}: UserProfileSelectProps<T>) => {
  const [value, setValue] = useState<T | undefined>(initialValue);

  const {
    usersApi: { getAllLimitedProfile }
  } = useApi();

  const { isPending, data: response } = useQuery({
    queryFn: getAllLimitedProfile,
    queryKey: buildQueryKey('limitedProfiles')
  });

  const handleOnChange = (
    changeValue: T,
    option: DefaultOptionType | DefaultOptionType[]
  ) => {
    if (onChange) {
      onChange(changeValue, option);
    }

    setValue(changeValue);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (!excludedUserId) return;

    setValue((prev) => {
      if (!prev) {
        return prev;
      }

      if (!Array.isArray(prev) && prev === excludedUserId) {
        return undefined;
      } else if (Array.isArray(prev) && prev.includes(excludedUserId)) {
        return prev.filter((x) => x !== excludedUserId) as T;
      } else {
        return prev;
      }
    });
  }, [excludedUserId]);

  let options: SelectProps['options'] = [];

  if (response) {
    const { data } = response;

    if (data.length) {
      options = data
        .filter((profile) => profile._id !== excludedUserId)
        .map((profile) => ({
          value: profile._id,
          label: profile.firstName + ' ' + profile.lastName
        }));
    }
  }

  return (
    <BaseSelect<T>
      {...props}
      onChange={handleOnChange}
      loading={isPending}
      value={value}
      options={options}
    />
  );
};

export default UserProfileSelect;
