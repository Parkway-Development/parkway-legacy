import { AxiosInstance } from 'axios';
import buildBaseApi, { BaseApiType } from './baseApi.ts';
import { Fund } from '../types/Fund.ts';

export type FundsApiType = BaseApiType<Fund>;

const buildFundsApi = (instance: AxiosInstance): FundsApiType =>
  buildBaseApi<Fund>(instance, '/api/fund');

export default buildFundsApi;
