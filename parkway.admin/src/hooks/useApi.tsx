import { useAuth } from './useAuth.tsx';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  AccountsApiType,
  AssetsApiType,
  AttendanceApiType,
  AttendanceCategoryApiType,
  buildAccountsApi,
  buildAssetsApi,
  buildAttendanceApi,
  buildAttendanceCategoryApi,
  buildContributionsApi,
  buildDepositsApi,
  buildEnumsApi,
  buildEventCategoriesApi,
  buildEventsApi,
  buildGeneralApi,
  buildSongsApi,
  buildTeamsApi,
  buildUsersApi,
  buildVendorsApi,
  ContributionsApiType,
  DepositsApiType,
  EnumsApiType,
  EventCategoriesApiType,
  EventsApiType,
  GeneralApiType,
  SongsApiType,
  TeamsApiType,
  UsersApiType,
  VendorsApiType
} from '../api';
import { QueryClient } from '@tanstack/react-query';
import { addDateConversionInterceptor } from '../utilities';
import { createContext, ReactNode, useContext } from 'react';
import { ApplicationError } from '../types/ApplicationError.ts';

export type GenericResponse = Promise<AxiosResponse<unknown, unknown>>;
export type TypedResponse<T> = Promise<Omit<AxiosResponse<T>, 'config'>>;

export interface BaseApiTypes {
  accountsApi: AccountsApiType;
  assetsApi: AssetsApiType;
  attendanceApi: AttendanceApiType;
  attendanceCategoryApi: AttendanceCategoryApiType;
  contributionsApi: ContributionsApiType;
  depositsApi: DepositsApiType;
  enumsApi: EnumsApiType;
  eventCategoriesApi: EventCategoriesApiType;
  eventsApi: EventsApiType;
  songsApi: SongsApiType;
  teamsApi: TeamsApiType;
  usersApi: UsersApiType;
  vendorsApi: VendorsApiType;
}

export type ApiType = BaseApiTypes & {
  formatError: (error: Error | ApplicationError | string | null) => string;
  generalApi: GeneralApiType;
};

const ApiContext = createContext<ApiType | undefined>(undefined);

export type QueryType =
  | 'accounts'
  | 'assets'
  | 'attendance'
  | 'attendanceCategory'
  | 'contributions'
  | 'deposits'
  | 'enums'
  | 'eventCategories'
  | 'events'
  | 'eventRegistrations'
  | 'organizationId'
  | 'passwordSettings'
  | 'limitedProfiles'
  | 'profiles'
  | 'songs'
  | 'teams'
  | 'vendors';

export const buildQueryKey = (queryType: QueryType, id?: string) => {
  const result: unknown[] = [queryType];
  if (id) result.push({ _id: id });
  return result;
};

export const invalidateQueries = (
  queryClient: QueryClient,
  queryType: QueryType
) => {
  return queryClient.invalidateQueries({ queryKey: [queryType] });
};

const createInstance = (token: string | undefined) => {
  const instance = axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'x-key': import.meta.env.VITE_APP_KEY,
      'x-app': import.meta.env.VITE_APP_SECRET
    },
    baseURL: import.meta.env.VITE_API_URL
  });

  addDateConversionInterceptor(instance);

  return instance;
};

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { token, logout } = useAuth();

  const formatError = (error: Error | ApplicationError | string | null) => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401 && token) {
        logout();
        return 'Invalid session';
      } else if (error.response?.status === 403) {
        return 'You do not have access to perform that action';
      }

      const message =
        error.response?.data?.error ?? error.response?.data?.message;
      if (typeof message === 'string') {
        return message;
      }
    } else if (typeof error === 'string') {
      return error;
    } else if (error && error.message) {
      return error.message;
    }

    return 'Unexpected error';
  };

  const instance = createInstance(token);

  const value = {
    accountsApi: buildAccountsApi(instance),
    assetsApi: buildAssetsApi(instance),
    attendanceApi: buildAttendanceApi(instance),
    attendanceCategoryApi: buildAttendanceCategoryApi(instance),
    contributionsApi: buildContributionsApi(instance),
    depositsApi: buildDepositsApi(instance),
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

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }

  return context;
};

export default useApi;
