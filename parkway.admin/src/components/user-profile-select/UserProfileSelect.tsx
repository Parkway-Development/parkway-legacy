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
    usersApi: { getAllLimitedProfile }
  } = useApi();

  const { isPending, data: response } = useQuery({
    queryFn: getAllLimitedProfile,
    queryKey: buildQueryKey('profiles')
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnChange = (changeValue: any) => {
    onChange(changeValue);
    setValue(changeValue);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

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
  }, [excludedUserId, isMultiSelect]);

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
