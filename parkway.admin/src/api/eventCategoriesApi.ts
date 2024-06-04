import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { EventCategory } from '../types';

export type EventCategoriesApiType = BaseApiType<EventCategory>;

export const buildEventCategoriesApi = (
  instance: AxiosInstance
): EventCategoriesApiType =>
  buildBaseApi<EventCategory>(instance, '/eventCategories');
