import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Event, EventMessage } from '../types';
import { TypedResponse } from '../hooks/useApi.ts';

export type ApproveEventPayload = Pick<
  Event,
  '_id' | 'approvedBy' | 'approvedDate'
>;

export type RejectEventPayload = Pick<
  Event,
  '_id' | 'rejectedBy' | 'rejectedDate'
>;

export type AddEventMessagePayload = Pick<Event, '_id'> & EventMessage;

export type EventsApiType = BaseApiType<Event> & {
  approve: (payload: ApproveEventPayload) => TypedResponse<Event>;
  reject: (payload: RejectEventPayload) => TypedResponse<Event>;
  addMessage: (payload: AddEventMessagePayload) => TypedResponse<Event>;
};

const basePath = '/events';

export const buildEventsApi = (instance: AxiosInstance): EventsApiType => ({
  ...buildBaseApi<Event>(instance, basePath),
  approve: ({ _id: id, ...payload }: ApproveEventPayload) =>
    instance.patch(`${basePath}/${id}/approve`, payload),
  reject: ({ _id: id, ...payload }: RejectEventPayload) =>
    instance.patch(`${basePath}/${id}/reject`, payload),
  addMessage: ({ _id: id, ...payload }: AddEventMessagePayload) =>
    instance.post(`${basePath}/${id}/message`, payload)
});
