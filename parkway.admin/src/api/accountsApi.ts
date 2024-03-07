import { AxiosInstance } from 'axios';
import buildBaseApi, { BaseApiType } from './baseApi.ts';
import { Account } from '../types/Account.ts';

export type AccountsApiType = BaseApiType<Account>;

const buildAccountsApi = (instance: AxiosInstance): AccountsApiType =>
  buildBaseApi<Account>(instance, '/api/accounts');

export default buildAccountsApi;
