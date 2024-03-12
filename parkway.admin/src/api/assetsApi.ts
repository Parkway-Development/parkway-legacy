import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Asset } from '../types/';

export type AssetsApiType = BaseApiType<Asset>;

export const buildAssetsApi = (instance: AxiosInstance): AssetsApiType =>
  buildBaseApi<Asset>(instance, '/api/accounting/assets');
