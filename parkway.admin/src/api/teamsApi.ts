import { Team } from '../types/Team.ts';
import { AxiosInstance } from 'axios';
import buildBaseApi, { BaseApiType } from './baseApi.ts';

export type TeamsApiType = BaseApiType<Team>;

const buildTeamsApi = (instance: AxiosInstance): TeamsApiType =>
  buildBaseApi<Team>(instance, '/api/teams');

export default buildTeamsApi;
