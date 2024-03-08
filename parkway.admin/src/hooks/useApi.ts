import { useAuth } from './useAuth.tsx';
import axios, { AxiosError, AxiosResponse } from 'axios';
import buildTeamsApi, { TeamsApiType } from '../api/teamsApi.ts';
import addUsersApi, { UsersApiType } from '../api/userApi.ts';
import buildGeneralApi, { GeneralApiType } from '../api/generalApi.ts';
import buildAccountsApi, { AccountsApiType } from '../api/accountsApi.ts';

export type GenericResponse = Promise<AxiosResponse<any, any>>;
export type TypedResponse<T> = Promise<Omit<AxiosResponse<T>, 'config'>>;

export type BaseApiTypes = {
  accountsApi: AccountsApiType;
  teamsApi: TeamsApiType;
  usersApi: UsersApiType;
};

export type ApiType = BaseApiTypes & {
  formatError: (error: Error | null) => string;
  generalApi: GeneralApiType;
};

export type QueryType = 'accounts' | 'passwordSettings' | 'profiles' | 'teams';

export const buildQueryKey = (queryType: QueryType, id?: string) => {
  const result: any[] = [queryType];
  if (id) result.push({ _id: id });
  return result;
};

const createInstance = (token: string | undefined) =>
  axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    },
    baseURL: import.meta.env.VITE_API_URL
  });

const useApi: () => ApiType = () => {
  const { token, logout } = useAuth();

  const formatError = (error: Error | null) => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
        return 'Invalid session';
      }

      const message =
        error.response?.data?.error ?? error.response?.data?.message;
      if (typeof message === 'string') {
        return message;
      }
    }

    return 'Unexpected error';
  };

  const instance = createInstance(token);

  return {
    accountsApi: buildAccountsApi(instance),
    generalApi: buildGeneralApi(instance),
    teamsApi: buildTeamsApi(instance),
    usersApi: addUsersApi(instance),
    formatError
  };
};

export default useApi;
