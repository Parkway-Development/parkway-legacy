import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Attendance } from '../types';
import { AttendanceEntry } from '../types/AttendanceEntry.ts';
import { TypedResponse } from '../hooks/useApi.ts';

export type AddEntryPayload = Omit<AttendanceEntry, '_id' | 'attendance'> & {
  attendanceId: string;
};

export type AttendanceApiType = BaseApiType<Attendance> & {
  addEntry: (
    addEntryPayload: AddEntryPayload
  ) => TypedResponse<AttendanceEntry>;
};

const basePath = '/attendance';

export const buildAttendanceApi = (
  instance: AxiosInstance
): AttendanceApiType => ({
  ...buildBaseApi<Attendance>(instance, basePath),
  addEntry: ({ attendanceId, ...payload }: AddEntryPayload) =>
    instance.post(`${basePath}/${attendanceId}/addEntry`, payload)
});
