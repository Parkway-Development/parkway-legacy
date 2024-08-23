import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { AttendanceCategory } from '../types';

export type AttendanceCategoryApiType = BaseApiType<AttendanceCategory>;

const basePath = '/attendance-categories';

export const buildAttendanceCategoryApi = (
  instance: AxiosInstance
): AttendanceCategoryApiType => ({
  ...buildBaseApi<AttendanceCategory>(instance, basePath)
});
