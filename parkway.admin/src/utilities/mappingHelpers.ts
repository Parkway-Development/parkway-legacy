import { SelectProps } from 'antd';

export const buildSelectOptionsFromMapping = (
  mapping: Record<string, string>
): SelectProps['options'] => {
  return Object.entries(mapping).map(([value, label]) => ({
    value,
    label
  }));
};

export const translateMapping = (
  mapping: Record<string, string>,
  value?: string
) => {
  if (!value) return undefined;
  return mapping[value];
};
