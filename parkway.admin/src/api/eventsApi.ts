import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Event } from '../types';

export type EventsApiType = BaseApiType<Event>;

export const buildEventsApi = (instance: AxiosInstance): EventsApiType =>
  buildBaseApi<Event>(instance, '/api/events');
