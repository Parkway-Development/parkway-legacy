import { AxiosInstance } from 'axios';
import buildBaseApi, { BaseApiType } from './baseApi.ts';
import { Contribution } from '../types';

export type ContributionsApiType = BaseApiType<Contribution>;

const buildContributionsApi = (instance: AxiosInstance): ContributionsApiType =>
  buildBaseApi<Contribution>(instance, '/api/accounting/contributions');

export default buildContributionsApi;
