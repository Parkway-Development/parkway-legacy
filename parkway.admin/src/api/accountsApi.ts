import { AxiosInstance } from 'axios';
import buildBaseApi, { BaseApiType } from './baseApi.ts';
import { Account } from '../types';

export type AccountsApiType = BaseApiType<Account>;

const buildAccountsApi = (instance: AxiosInstance): AccountsApiType =>
  buildBaseApi<Account>(instance, '/api/accounting/accounts');

export default buildAccountsApi;
