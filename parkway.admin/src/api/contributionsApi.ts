import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Contribution } from '../types';

export type ContributionsApiType = BaseApiType<Contribution>;

export const buildContributionsApi = (
  instance: AxiosInstance
): ContributionsApiType =>
  buildBaseApi<Contribution>(instance, '/api/accounting/contributions');
