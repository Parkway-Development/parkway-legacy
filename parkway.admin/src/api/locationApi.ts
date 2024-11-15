import { AxiosInstance } from 'axios';
import { Location } from '../types';
import { BaseApiType, buildBaseApi } from './baseApi.ts';

export type LocationApiType = BaseApiType<Location>;

const basePath = '/locations';

export const buildLocationApi = (instance: AxiosInstance): LocationApiType => ({
  ...buildBaseApi<Location>(instance, basePath)
});
