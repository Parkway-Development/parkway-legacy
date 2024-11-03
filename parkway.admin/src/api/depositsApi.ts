import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Deposit } from '../types';
import { TypedResponse } from '../hooks/useApi.tsx';

export type DepositsApiType = Omit<BaseApiType<Deposit>, 'create'> & {
  create: (payload: CreateDepositPayload) => TypedResponse<Deposit>;
  execute: (payload: ExecuteDepositPayload) => TypedResponse<Deposit>;
  process: (payload: ProcessDepositPayload) => TypedResponse<Deposit>;
  getDepositsByDateRange: (
    input: GetDepositsByDateRangeInput
  ) => TypedResponse<Deposit[]>;
};

export type CreateDepositPayload = Pick<
  Deposit,
  'amount' | 'responsiblePartyProfileId'
>;

export type ExecuteDepositPayload = Pick<
  Deposit,
  '_id' | 'responsiblePartyProfileId'
>;

export type ProcessDepositPayload = Pick<Deposit, '_id' | 'approverProfileId'>;

export type GetDepositsByDateRangeInput = {
  startDate: Date;
  endDate: Date;
};

export const buildDepositsApi = (instance: AxiosInstance): DepositsApiType => {
  const basePath = '/accounting/deposits';
  return {
    ...buildBaseApi<Deposit>(instance, basePath),
    create: (payload) => instance.post(basePath, payload),
    execute: (payload) =>
      instance.post(`${basePath}/execute/${payload._id}`, payload),
    process: (payload) =>
      instance.post(`${basePath}/process/${payload._id}`, payload),
    getDepositsByDateRange: (input) =>
      instance.get(`${basePath}/bydaterange`, {
        params: input
      })
  };
};
