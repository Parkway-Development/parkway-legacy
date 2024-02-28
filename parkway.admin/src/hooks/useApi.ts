import { LoginResponse, useAuth } from './useAuth.tsx';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export type GenericResponse = Promise<AxiosResponse<any, any>>;
export type TypedResponse<T> = Promise<AxiosResponse<T>>;

type ApiType = {
  deleteTeam: (id: string) => GenericResponse;
  formatError: (error: Error | null) => string;
  login: (payload: LoginFields) => TypedResponse<LoginResponse>;
};

const createInstance = (token: string | undefined) =>
  axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    },
    baseURL: import.meta.env.VITE_API_URL
  });

const deleteTeam = (instance: AxiosInstance, id: string) =>
  instance.delete(`/api/team/${id}`);

export interface LoginFields {
  email: string;
  password: string;
}

const login = (instance: AxiosInstance, payload: LoginFields) =>
  instance.post<LoginResponse>('/api/user/login', payload);

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
    deleteTeam: (id) => deleteTeam(instance, id),
    formatError,
    login: (payload) => login(instance, payload)
  };
};

export default useApi;
