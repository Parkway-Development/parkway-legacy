import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Contribution, ContributionType } from '../types';
import { TypedResponse } from '../hooks/useApi.tsx';
import { ApplicationError } from '../types/ApplicationError.ts';

export type ContributionsApiType = Omit<BaseApiType<Contribution>, 'create'> & {
  create: (
    payload: CreateContributionPayload
  ) => TypedResponse<CreateContributionResponse>;
};

type AccountPayload = {
  accountId: string;
  amount: number;
};

type IndividualContributionPayload = {
  gross: number;
  fees: number;
  net: number;
  accounts: AccountPayload[];
  contributorProfileId?: string; // undefined for cash/anonymous
  depositId?: string;
  transactionDate: string;
  type: ContributionType;
  notes: string[];
  responsiblePartyProfileId: string;
};

type CreateContributionPayload = IndividualContributionPayload[];

type CreateContributionResponse = {
  successfulContributions: Contribution[];
  failedContributions: {
    data?: Contribution;
    errors: ApplicationError[];
  }[];
};

export const buildContributionsApi = (
  instance: AxiosInstance
): ContributionsApiType => {
  const basePath = '/accounting/contributions';
  return {
    ...buildBaseApi<Contribution>(instance, basePath),
    create: (payload) => instance.post(basePath, payload)
  };
};
