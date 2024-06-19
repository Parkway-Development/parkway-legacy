import { Input, InputProps } from 'antd';

export const getTimeSelectHours = (value: string) => {
  return Number(value.split(':')[0]);
};

export const getTimeSelectMinutes = (value: string) => {
  return Number(value.split(':')[1]);
};

export const isEndTimeAfterStart = (startTime: string, endTime: string) => {
  const startValues = startTime.split(':');
  const endValues = endTime.split(':');

  const start = Number(startValues[0]) * 60 + Number(startValues[1]);
  const end = Number(endValues[0]) * 60 + Number(endValues[1]);

  return end > start;
};

type TimeSelectProps = Omit<InputProps, 'type'>;

const TimePicker = (props: TimeSelectProps) => {
  return <Input type="time" {...props} />;
};

export default TimePicker;
