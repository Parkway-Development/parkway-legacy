import { Team } from '../types';
import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';

export type TeamsApiType = BaseApiType<Team>;

export const buildTeamsApi = (instance: AxiosInstance): TeamsApiType =>
  buildBaseApi<Team>(instance, '/teams');
