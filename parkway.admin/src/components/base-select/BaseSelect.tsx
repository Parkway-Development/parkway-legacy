import { Select, SelectProps } from 'antd';

type BaseSelection<T> = Pick<SelectProps, 'options' | 'value' | 'loading'> & {
  onChange: (values: T | undefined) => void;
};

export type SingleSelectionProps = BaseSelection<string> & {
  isMultiSelect?: false;
};

export type MultipleSelectionProps = BaseSelection<string[]> & {
  isMultiSelect: true;
};

export type BaseSelectionProps = SingleSelectionProps | MultipleSelectionProps;

const BaseSelect = ({
  isMultiSelect = false,
  onChange,
  ...props
}: BaseSelectionProps) => {
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

export default BaseSelect;
