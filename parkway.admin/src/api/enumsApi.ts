import { AxiosInstance } from 'axios';
import { Enum } from '../types';
import { BaseApiType, buildBaseApi } from './baseApi.ts';

export type EnumsApiType = BaseApiType<Enum>;

export const buildEnumsApi = (instance: AxiosInstance): EnumsApiType =>
  buildBaseApi<Enum>(instance, '/api/platform/enums');
