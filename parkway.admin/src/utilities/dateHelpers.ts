import dayjs from 'dayjs';

export const transformDateToDayjs = (date: Date | undefined) => {
  return date ? dayjs(date) : undefined;
};

export const transformToTime = (date: Date) =>
  new Date(date).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });

export const isSameDate = (dateA: Date, dateB: Date) => {
  const a = new Date(dateA);
  const b = new Date(dateB);

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};
