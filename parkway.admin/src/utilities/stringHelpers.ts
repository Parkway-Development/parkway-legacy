import dayjs from 'dayjs';

const isValidDate = (date: any): boolean => {
  if (date instanceof dayjs) return true;

  return (
    date &&
    Object.prototype.toString.call(date) === '[object Date]' &&
    !isNaN(date)
  );
};

export const trimStrings = <T extends {}>(payload: T): T => {
  const trimmedPayload = { ...payload };

  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string') {
      // @ts-ignore
      trimmedPayload[key] = value.trim();
    } else if (isValidDate(value)) {
      // do nothing
    } else if (Array.isArray(value)) {
      // @ts-ignore
      trimmedPayload[key] = value.map((item) => {
        if (typeof item === 'string') return item.trim();
        if (isValidDate(item)) return item;
        if (typeof item === 'object') return trimStrings(item);
        return item;
      });
    } else if (typeof value === 'object') {
      // @ts-ignore
      trimmedPayload[key] = trimStrings(value);
    }
  }

  return trimmedPayload;
};

export const convertToStringArray = (input: string): string[] => {
  if (!input) return [];

  return input
    .split('\n')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
};

export const convertFromStringArray = (input: string[] | undefined): string => {
  if (!input) return '';

  return input.reduce(
    (prev, currentValue) =>
      prev.length ? prev + '\n' + currentValue : currentValue,
    ''
  );
};
