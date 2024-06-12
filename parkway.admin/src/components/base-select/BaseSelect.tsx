import { Select, SelectProps } from 'antd';

export type SingleSelectionProps<T> = SelectProps<T> & {
  isMultiSelect?: false;
};

export type MultipleSelectionProps<T> = SelectProps<T> & {
  isMultiSelect: true;
};

export type BaseSelectionProps<T> =
  | SingleSelectionProps<T>
  | MultipleSelectionProps<T>;

export const BaseSelect = <T,>({
  isMultiSelect = false,
  loading,
  value,
  ...props
}: BaseSelectionProps<T>) => {
  return (
    <Select<T>
      mode={isMultiSelect ? 'multiple' : undefined}
      optionFilterProp="label"
      allowClear
      showSearch
      loading={loading}
      value={loading ? undefined : value}
      {...props}
    />
  );
};
