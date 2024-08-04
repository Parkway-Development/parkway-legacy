import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Deposit } from '../types';
import { TypedResponse } from '../hooks/useApi.tsx';

export type DepositsApiType = Omit<BaseApiType<Deposit>, 'create'> & {
  create: (payload: CreateDepositPayload) => TypedResponse<Deposit>;
  getDepositsByDateRange: (
    input: GetDepositsByDateRangeInput
  ) => TypedResponse<Deposit[]>;
};

export type CreateDepositPayload = Pick<
  Deposit,
  'amount' | 'responsiblePartyProfileId'
>;

export type GetDepositsByDateRangeInput = {
  startDate: Date;
  endDate: Date;
};

export const buildDepositsApi = (instance: AxiosInstance): DepositsApiType => {
  const basePath = '/accounting/deposits';
  return {
    ...buildBaseApi<Deposit>(instance, basePath),
    create: (payload) => instance.post(basePath, payload),
    getDepositsByDateRange: (input) =>
      instance.get(`${basePath}/bydaterange`, {
        params: input
      })
  };
};
