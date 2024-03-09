import { AxiosInstance } from 'axios';
import buildBaseApi, { BaseApiType } from './baseApi.ts';
import { Contribution } from '../types/Contribution.ts';

export type ContributionsApiType = BaseApiType<Contribution>;

const buildContributionsApi = (instance: AxiosInstance): ContributionsApiType =>
  buildBaseApi<Contribution>(instance, '/api/accounting/contributions');

export default buildContributionsApi;
