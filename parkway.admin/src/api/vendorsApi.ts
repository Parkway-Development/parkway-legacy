import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Vendor } from '../types';

export type VendorsApiType = BaseApiType<Vendor>;

export const buildVendorsApi = (instance: AxiosInstance): VendorsApiType =>
  buildBaseApi<Vendor>(instance, '/api/accounting/vendors');
