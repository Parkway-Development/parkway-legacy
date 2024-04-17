import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Event } from '../types';
import { TypedResponse } from '../hooks/useApi.ts';

export type ApproveEventPayload = Pick<
  Event,
  '_id' | 'approvedBy' | 'approvedDate'
>;

export type EventsApiType = BaseApiType<Event> & {
  approve: (payload: ApproveEventPayload) => TypedResponse<Event>;
};

const basePath = '/api/events';

export const buildEventsApi = (instance: AxiosInstance): EventsApiType => ({
  ...buildBaseApi<Event>(instance, basePath),
  approve: ({ _id: id, ...payload }: ApproveEventPayload) =>
    instance.patch(`${basePath}/${id}/approve`, payload)
});
