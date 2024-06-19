import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Event, EventMessage } from '../types';
import { GenericResponse, TypedResponse } from '../hooks/useApi.tsx';
import { EventRegistration } from '../types/EventRegistration.ts';

export type ApproveEventPayload = Pick<
  Event,
  '_id' | 'approvedBy' | 'approvedDate'
>;

export type RejectEventPayload = Pick<
  Event,
  '_id' | 'rejectedBy' | 'rejectedDate'
>;

export type AddEventMessagePayload = Pick<Event, '_id'> & EventMessage;

export type DeleteBySchedulePayload = Pick<Event, '_id'> & {
  updateSeries: 'future' | 'all';
};

export type RegisterForEventPayload = {
  eventId: string;
  profile: string;
  slots: string[];
};

export type EventsApiType = BaseApiType<Event> & {
  approve: (payload: ApproveEventPayload) => TypedResponse<Event>;
  reject: (payload: RejectEventPayload) => TypedResponse<Event>;
  addMessage: (payload: AddEventMessagePayload) => TypedResponse<Event>;
  deleteBySchedule: (payload: DeleteBySchedulePayload) => GenericResponse;
  register: (
    payload: RegisterForEventPayload
  ) => TypedResponse<EventRegistration>;
  getRegistrations: (
    payload: Pick<Event, '_id'>
  ) => TypedResponse<EventRegistration[]>;
};

const basePath = '/events';

export const buildEventsApi = (instance: AxiosInstance): EventsApiType => ({
  ...buildBaseApi<Event>(instance, basePath),
  approve: ({ _id: id, ...payload }: ApproveEventPayload) =>
    instance.patch(`${basePath}/${id}/approve`, payload),
  reject: ({ _id: id, ...payload }: RejectEventPayload) =>
    instance.patch(`${basePath}/${id}/reject`, payload),
  addMessage: ({ _id: id, ...payload }: AddEventMessagePayload) =>
    instance.post(`${basePath}/${id}/message`, payload),
  deleteBySchedule: ({ _id: id, updateSeries }: DeleteBySchedulePayload) =>
    instance.delete(`${basePath}/${id}/schedule/${updateSeries}`),
  register: ({ eventId: id, ...payload }: RegisterForEventPayload) =>
    instance.post(`${basePath}/${id}/register`, payload),
  getRegistrations: ({ _id: id }: Pick<Event, '_id'>) =>
    instance.get(`${basePath}/${id}/registrations`)
});
