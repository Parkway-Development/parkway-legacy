import { useAuth } from './useAuth.tsx';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  AccountsApiType,
  AssetsApiType,
  buildAccountsApi,
  buildAssetsApi,
  buildContributionsApi,
  buildEnumsApi,
  buildEventCategoriesApi,
  buildEventsApi,
  buildGeneralApi,
  buildSongsApi,
  buildTeamsApi,
  buildUsersApi,
  buildVendorsApi,
  ContributionsApiType,
  EnumsApiType,
  EventCategoriesApiType,
  EventsApiType,
  GeneralApiType,
  SongsApiType,
  TeamsApiType,
  UsersApiType,
  VendorsApiType
} from '../api';

export type GenericResponse = Promise<AxiosResponse<any, any>>;
export type TypedResponse<T> = Promise<Omit<AxiosResponse<T>, 'config'>>;

export type BaseApiTypes = {
  accountsApi: AccountsApiType;
  assetsApi: AssetsApiType;
  contributionsApi: ContributionsApiType;
  enumsApi: EnumsApiType;
  eventCategoriesApi: EventCategoriesApiType;
  eventsApi: EventsApiType;
  songsApi: SongsApiType;
  teamsApi: TeamsApiType;
  usersApi: UsersApiType;
  vendorsApi: VendorsApiType;
};

export type ApiType = BaseApiTypes & {
  formatError: (error: Error | null) => string;
  generalApi: GeneralApiType;
};

export type QueryType =
  | 'accounts'
  | 'assets'
  | 'contributions'
  | 'enums'
  | 'eventCategories'
  | 'events'
  | 'passwordSettings'
  | 'profiles'
  | 'songs'
  | 'teams'
  | 'vendors';

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
    assetsApi: buildAssetsApi(instance),
    contributionsApi: buildContributionsApi(instance),
    enumsApi: buildEnumsApi(instance),
    eventCategoriesApi: buildEventCategoriesApi(instance),
    eventsApi: buildEventsApi(instance),
    generalApi: buildGeneralApi(instance),
    songsApi: buildSongsApi(instance),
    teamsApi: buildTeamsApi(instance),
    usersApi: buildUsersApi(instance),
    vendorsApi: buildVendorsApi(instance),
    formatError
  };
};

export default useApi;
