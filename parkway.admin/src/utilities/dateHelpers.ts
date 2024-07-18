import { AxiosInstance, AxiosResponse } from 'axios';
import { format } from 'date-fns';

export const transformToTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });

export const getDateString = (date: Date | undefined) =>
  date ? format(date, 'yyyy-MM-dd') : undefined;

export const getTimeString = (date: Date | undefined) =>
  date ? format(date, 'HH:mm') : undefined;

export const isDateString = (value: unknown): boolean =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

export const isDateTimeString = (value: unknown): boolean =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value);

export const convertDates = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => convertDates(item));
  }

  if (typeof obj === 'object') {
    const newObj: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = (obj as Record<string, unknown>)[key];
        newObj[key] = isDateTimeString(value)
          ? new Date(value as string)
          : convertDates(value);
      }
    }

    return newObj;
  }

  return obj;
};

export const addDateConversionInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Convert date strings to Date objects
      response.data = convertDates(response.data);
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
