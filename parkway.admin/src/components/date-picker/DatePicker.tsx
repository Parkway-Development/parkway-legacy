import { Input, InputProps } from 'antd';

type DatePickerExtendedProps = Omit<InputProps, 'type'>;

const DatePicker = (props: DatePickerExtendedProps) => {
  console.log('date props', props);
  return <Input type="date" {...props} />;
};

export default DatePicker;
