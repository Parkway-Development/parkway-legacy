import { BaseSelect, BaseSelectionProps } from '../base-select';
import { DefaultOptionType } from 'antd/lib/select/index';

const options: DefaultOptionType[] = [];

for (let i = 0; i < 24; i++) {
  for (let j = 0; j < 4; j++) {
    let hour: number;
    let suffix: string;
    if (i === 0) {
      hour = 12;
      suffix = 'AM';
    } else if (i > 12) {
      hour = i - 12;
      suffix = 'PM';
    } else {
      hour = i;
      suffix = i < 12 ? 'AM' : 'PM';
    }

    const option = {
      label: `${hour}:${j > 0 ? j * 15 : '00'} ${suffix}`,
      value: `${i}:${j * 15}`
    };

    options.push(option);
  }
}

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

export const getTimeSelectValue = (value: Date) => {
  return `${value.getHours()}:${value.getMinutes()}`;
};

const TimeSelect = (props: BaseSelectionProps<string>) => {
  return <BaseSelect<string> allowClear={false} options={options} {...props} />;
};

export default TimeSelect;
