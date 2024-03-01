import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectProps } from 'antd';
import { useEffect, useState } from 'react';

type BaseSelection<T> = {
  onChange: (values: T | undefined) => void;
  initialValue?: T;
};

type SingleSelection = BaseSelection<string> & {
  isMultiSelect?: false;
};

type MultipleSelection = BaseSelection<string[]> & {
  isMultiSelect: true;
};

type SelectionProps = SingleSelection | MultipleSelection;

type UserProfileSelectProps = SelectionProps & {
  excludedUserId?: string;
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
  const { getProfiles } = useApi();
  const { isPending, data: response } = useQuery({
    queryFn: getProfiles,
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
          label: profile.firstname + ' ' + profile.lastname
        }));
    }
  }

  return (
    <Select
      mode={isMultiSelect ? 'multiple' : undefined}
      onChange={handleOnChange}
      options={options}
      value={isPending ? undefined : value}
      loading={isPending}
      optionFilterProp="label"
      allowClear
      showSearch
    />
  );
};

export default UserProfileSelect;
