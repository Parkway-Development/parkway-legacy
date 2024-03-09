import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import { BaseSelect, BaseSelectionProps } from '../base-select';

type UserProfileSelectProps = Omit<BaseSelectionProps, 'value'> & {
  excludedUserId?: string;
  initialValue?: BaseSelectionProps['value'];
};

const UserProfileSelect = ({
  isMultiSelect = false,
  onChange,
  excludedUserId,
  initialValue
}: UserProfileSelectProps) => {
  const [value, setValue] = useState<string | string[] | undefined>(
    initialValue
  );
  const {
    usersApi: { getAll }
  } = useApi();
  const { isPending, data: response } = useQuery({
    queryFn: getAll,
    queryKey: buildQueryKey('profiles')
  });

  const handleOnChange = (changeValue: any) => {
    onChange(changeValue);
    setValue(changeValue);
  };

  useEffect(() => {
    if (!excludedUserId) return;

    if (isMultiSelect) {
      setValue((prev) =>
        prev && Array.isArray(prev) && prev.includes(excludedUserId)
          ? prev.filter((x) => x !== excludedUserId)
          : prev
      );
    } else {
      setValue((prev) =>
        prev && !Array.isArray(prev) && prev === excludedUserId
          ? undefined
          : prev
      );
    }
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
    <BaseSelect
      isMultiSelect={isMultiSelect}
      onChange={handleOnChange}
      loading={isPending}
      options={options}
      value={value}
    />
  );
};

export default UserProfileSelect;
