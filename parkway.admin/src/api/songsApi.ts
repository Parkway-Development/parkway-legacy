import { Song } from '../types';
import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';

export type SongsApiType = BaseApiType<Song>;

export const buildSongsApi = (instance: AxiosInstance): SongsApiType =>
  buildBaseApi<Song>(instance, '/songs');
