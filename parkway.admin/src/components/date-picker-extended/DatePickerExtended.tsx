import { DatePicker, DatePickerProps } from 'antd';

type DatePickerExtendedProps = Omit<DatePickerProps, 'format'>;

const DatePickerExtended = (props: DatePickerExtendedProps) => {
  return (
    <DatePicker
      {...props}
      format={['M/D/YYYY', 'MM/DD/YYYY', 'M/D/YY', 'YYYY-MM-DD']}
    />
  );
};

export default DatePickerExtended;
