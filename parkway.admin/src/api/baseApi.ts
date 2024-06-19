import { BaseEntity } from '../types';
import { GenericResponse, TypedResponse } from '../hooks/useApi.tsx';
import { AxiosInstance } from 'axios';

export interface GenericMessageResponse {
  message: string;
}

export interface BaseApiType<T extends BaseEntity> {
  create: (payload: Omit<T, '_id'>) => TypedResponse<T>;
  delete: (id: string) => GenericResponse;
  getById: (id: string) => () => TypedResponse<T>;
  getAll: () => TypedResponse<T[]>;
  update: (payload: T) => TypedResponse<T>;
}

export const IsBaseEntityApi = <T extends BaseEntity>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiEntity: any
): apiEntity is BaseApiType<T> =>
  Object.keys(apiEntity).includes('getAll') &&
  Object.keys(apiEntity).includes('getById');

export const buildBaseApi = <T extends BaseEntity>(
  instance: AxiosInstance,
  basePath: string
): BaseApiType<T> => ({
  create: (payload) => instance.post(basePath, payload),
  delete: (id) => instance.delete(`${basePath}/${id}`),
  getById: (id) => () => instance.get<T>(`${basePath}/${id}`),
  getAll: () => instance.get<T[]>(basePath),
  update: ({ _id: id, ...payload }: T) =>
    instance.patch(`${basePath}/${id}`, payload)
});
