import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Attendance } from '../types';

export type AttendanceApiType = BaseApiType<Attendance>;

export const buildAttendanceApi = (
  instance: AxiosInstance
): AttendanceApiType =>
  buildBaseApi<Attendance>(instance, '/attendance');
