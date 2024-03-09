import dayjs from 'dayjs';

export const transformDateForDatePicker = (date: Date | undefined) => {
  return date ? dayjs(date, 'YYYY-MM-DD') : undefined;
};
