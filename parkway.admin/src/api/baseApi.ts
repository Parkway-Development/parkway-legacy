import { BaseEntity } from '../types/BaseEntity.ts';
import { GenericResponse, TypedResponse } from '../hooks/useApi.ts';
import { AxiosInstance } from 'axios';

export type BaseApiType<T extends BaseEntity> = {
  create: (payload: Omit<T, '_id'>) => TypedResponse<T>;
  delete: (id: string) => GenericResponse;
  getById: (id: string) => () => TypedResponse<T>;
  getAll: () => TypedResponse<T[]>;
  update: (payload: T) => TypedResponse<T>;
};

export const IsBaseEntityApi = <T extends BaseEntity>(
  apiEntity: any
): apiEntity is BaseApiType<T> =>
  Object.keys(apiEntity).includes('getAll') &&
  Object.keys(apiEntity).includes('getById');

const buildBaseApi = <T extends BaseEntity>(
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

export default buildBaseApi;
