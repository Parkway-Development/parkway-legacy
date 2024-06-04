import { AxiosInstance } from 'axios';
import { BaseApiType, buildBaseApi } from './baseApi.ts';
import { Account } from '../types';
import { TypedResponse } from '../hooks/useApi.ts';

export type UpdateAccountCustodianPayload = Pick<Account, '_id'> & {
  custodian: string;
};

export type AddAccountParentPayload = Pick<Account, '_id'> & {
  parent: string;
};

export type AddAccountChildrenPayload = Pick<Account, '_id'> & {
  children: string[];
};

export type AccountsApiType = BaseApiType<Account> & {
  updateCustodian: (
    payload: UpdateAccountCustodianPayload
  ) => TypedResponse<Account>;
  addParent: (payload: AddAccountParentPayload) => TypedResponse<Account>;
  addChildren: (payload: AddAccountChildrenPayload) => TypedResponse<Account>;
};

const basePath = '/accounting/accounts';

export const buildAccountsApi = (instance: AxiosInstance): AccountsApiType => ({
  ...buildBaseApi<Account>(instance, basePath),
  updateCustodian: ({ _id: id, ...payload }: UpdateAccountCustodianPayload) =>
    instance.patch(`${basePath}/updatecustodian/${id}`, payload),
  addParent: ({ _id: id, ...payload }: AddAccountParentPayload) =>
    instance.patch(`${basePath}/addparent/${id}`, payload),
  addChildren: ({ _id: id, ...payload }: AddAccountChildrenPayload) =>
    instance.patch(`${basePath}/addchildren/${id}`, payload)
});
