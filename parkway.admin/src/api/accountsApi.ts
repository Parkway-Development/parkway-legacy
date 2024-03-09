import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Account } from '../types';

export type AccountsApiType = BaseApiType<Account>;

export const buildAccountsApi = (instance: AxiosInstance): AccountsApiType =>
  buildBaseApi<Account>(instance, '/api/accounting/accounts');
