import { Select, SelectProps } from 'antd';

type BaseSelection<T> = Omit<SelectProps, 'onChange'> & {
  onChange: (values: T | undefined) => void;
};

export type SingleSelectionProps = BaseSelection<string> & {
  isMultiSelect?: false;
};

export type MultipleSelectionProps = BaseSelection<string[]> & {
  isMultiSelect: true;
};

export type BaseSelectionProps = SingleSelectionProps | MultipleSelectionProps;

// TODO: Rework this to provide a selection option or something to return instead of magic strings
export const BaseSelect = ({
  isMultiSelect = false,
  onChange,
  ...props
}: BaseSelectionProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnChange = (changeValue: any) => {
    onChange(changeValue);
  };

  return (
    <Select
      mode={isMultiSelect ? 'multiple' : undefined}
      onChange={handleOnChange}
      optionFilterProp="label"
      allowClear
      showSearch
      {...props}
    />
  );
};
