import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Event } from '../types';
import { TypedResponse } from '../hooks/useApi.ts';

export type ApproveEventPayload = Pick<
  Event,
  '_id' | 'approvedBy' | 'approvedDate'
>;

export type RejectEventPayload = Pick<
  Event,
  '_id' | 'rejectedBy' | 'rejectedDate'
>;

export type EventsApiType = BaseApiType<Event> & {
  approve: (payload: ApproveEventPayload) => TypedResponse<Event>;
  reject: (payload: RejectEventPayload) => TypedResponse<Event>;
};

const basePath = '/api/events';

export const buildEventsApi = (instance: AxiosInstance): EventsApiType => ({
  ...buildBaseApi<Event>(instance, basePath),
  approve: ({ _id: id, ...payload }: ApproveEventPayload) =>
    instance.patch(`${basePath}/${id}/approve`, payload),
  reject: ({ _id: id, ...payload }: RejectEventPayload) =>
    instance.patch(`${basePath}/${id}/reject`, payload)
});
