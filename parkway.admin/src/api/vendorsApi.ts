import { AxiosInstance } from 'axios';
import buildBaseApi, { BaseApiType } from './baseApi.ts';
import { Vendor } from '../types';

export type VendorsApiType = BaseApiType<Vendor>;

const buildVendorsApi = (instance: AxiosInstance): VendorsApiType =>
  buildBaseApi<Vendor>(instance, '/api/accounting/vendors');

export default buildVendorsApi;
