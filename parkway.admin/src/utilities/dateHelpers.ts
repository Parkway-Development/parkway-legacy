import dayjs from 'dayjs';

export const transformDateToDayjs = (date: Date | undefined) => {
  return date ? dayjs(date) : undefined;
};
