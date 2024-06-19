import { Input, InputProps } from 'antd';

type DatePickerExtendedProps = Omit<InputProps, 'type'>;

const DatePicker = (props: DatePickerExtendedProps) => {
  return <Input type="date" {...props} />;
};

export default DatePicker;
