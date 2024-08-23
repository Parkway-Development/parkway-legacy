import { AxiosInstance } from 'axios';
import { AttendanceEntry } from '../types/AttendanceEntry.ts';
import { GenericResponse, TypedResponse } from '../hooks/useApi.ts';

export type AddEntryPayload = Omit<AttendanceEntry, '_id' | 'attendance'> & {
  attendanceId: string;
};

export type UpdateEntryPayload = Omit<AttendanceEntry, 'attendance'> & {
  attendanceId: string;
};

export type GetAttendanceEntriesByDateRangeInput = {
  startDate: Date;
  endDate: Date;
};

export type AttendanceApiType = {
  addEntry: (
    addEntryPayload: AddEntryPayload
  ) => TypedResponse<AttendanceEntry>;
  getEntries: (attendanceId: string) => TypedResponse<AttendanceEntry[]>;
  deleteEntry: (params: {
    attendanceId: string;
    attendanceEntryId: string;
  }) => GenericResponse;
  updateEntry: (
    updateEntryPayload: UpdateEntryPayload
  ) => TypedResponse<AttendanceEntry>;
  getAttendanceEntriesByDateRange: (
    input: GetAttendanceEntriesByDateRangeInput
  ) => TypedResponse<AttendanceEntry[]>;
};

const basePath = '/attendance';

export const buildAttendanceApi = (
  instance: AxiosInstance
): AttendanceApiType => ({
  addEntry: ({ attendanceId, ...payload }: AddEntryPayload) =>
    instance.post(`${basePath}/${attendanceId}/addEntry`, payload),
  getEntries: (attendanceId) =>
    instance.get(`${basePath}/${attendanceId}/entries`),
  deleteEntry: ({ attendanceId, attendanceEntryId }) =>
    instance.delete(`${basePath}/${attendanceId}/entries/${attendanceEntryId}`),
  updateEntry: ({ attendanceId, _id: id, ...payload }: UpdateEntryPayload) =>
    instance.patch(`${basePath}/${attendanceId}/entries/${id}`, payload),
  getAttendanceEntriesByDateRange: (input) =>
    instance.get(`${basePath}/bydaterange`, {
      params: input
    })
});
