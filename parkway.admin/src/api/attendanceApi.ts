import { AxiosInstance } from 'axios';
import { Attendance } from '../types/Attendance.ts';
import { TypedResponse } from '../hooks/useApi.ts';
import { BaseApiType, buildBaseApi } from './baseApi.ts';

export type GetAttendancesByDateRangeInput = {
  startDate: Date;
  endDate: Date;
};

export type AttendanceApiType = BaseApiType<Attendance> & {
  getAttendanceEntriesByDateRange: (
    input: GetAttendancesByDateRangeInput
  ) => TypedResponse<Attendance[]>;
};

const basePath = '/attendance';

export const buildAttendanceApi = (
  instance: AxiosInstance
): AttendanceApiType => ({
  ...buildBaseApi<Attendance>(instance, basePath),
  getAttendanceEntriesByDateRange: (input) =>
    instance.get(`${basePath}/bydaterange`, {
      params: input
    })
});
