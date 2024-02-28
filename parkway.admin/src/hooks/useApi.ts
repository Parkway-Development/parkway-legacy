import { LoginResponse, useAuth } from './useAuth.tsx';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Team } from '../types/Team.ts';
import { UserProfile } from '../types/UserProfile.ts';

export type GenericResponse = Promise<AxiosResponse<any, any>>;
export type TypedResponse<T> = Promise<AxiosResponse<T>>;

type ApiType = {
  createTeam: (payload: Omit<Team, '_id'>) => TypedResponse<Team>;
  deleteTeam: (id: string) => GenericResponse;
  getPasswordSettings: () => TypedResponse<PasswordSettings>;
  getProfiles: () => TypedResponse<UserProfile[]>;
  getTeams: () => TypedResponse<Team[]>;
  formatError: (error: Error | null) => string;
  login: (payload: LoginFields) => TypedResponse<LoginResponse>;
  signup: (payload: LoginFields) => TypedResponse<LoginResponse>;
};

export interface PasswordSettings {
  minimumLength: number;
  minimumLowercase: number;
  minimumUppercase: number;
  minimumNumbers: number;
  minimumSymbols: number;
}

const createInstance = (token: string | undefined) =>
  axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    },
    baseURL: import.meta.env.VITE_API_URL
  });

const createTeam = (instance: AxiosInstance, payload: Omit<Team, '_id'>) =>
  instance.post('/api/team', payload);

const deleteTeam = (instance: AxiosInstance, id: string) =>
  instance.delete(`/api/team/${id}`);

const getPasswordSettings = (instance: AxiosInstance) =>
  instance.get<PasswordSettings>('/api/setting/password');

const getProfiles = (instance: AxiosInstance) =>
  instance.get<UserProfile[]>('/api/profile');

const getTeams = (instance: AxiosInstance) => instance.get<Team[]>('/api/team');

export interface LoginFields {
  email: string;
  password: string;
}

const login = (instance: AxiosInstance, payload: LoginFields) =>
  instance.post<LoginResponse>('/api/user/login', payload);

const signup = (instance: AxiosInstance, payload: LoginFields) =>
  instance.post<LoginResponse>('/api/user/connect', payload);

const useApi: () => ApiType = () => {
  const { token, logout } = useAuth();

  const formatError = (error: Error | null) => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
        return 'Invalid session';
      }

      const message = error.response?.data?.err;
      if (typeof message === 'string') {
        return message;
      }
    }

    return 'Unexpected error';
  };

  const instance = createInstance(token);

  return {
    createTeam: (payload) => createTeam(instance, payload),
    deleteTeam: (id) => deleteTeam(instance, id),
    getPasswordSettings: () => getPasswordSettings(instance),
    getProfiles: () => getProfiles(instance),
    getTeams: () => getTeams(instance),
    formatError,
    login: (payload) => login(instance, payload),
    signup: (payload) => signup(instance, payload)
  };
};

export default useApi;
