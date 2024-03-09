import { UserProfile } from '../types';
import { LoginResponse } from '../hooks/useAuth.tsx';
import { TypedResponse } from '../hooks/useApi.ts';
import { AxiosInstance } from 'axios';
import buildBaseApi, { BaseApiType } from './baseApi.ts';

export type UsersApiType = BaseApiType<UserProfile> & {
  joinProfileAndUser: (payload: JoinProfileInput) => TypedResponse<UserProfile>;
  login: (payload: LoginFields) => TypedResponse<LoginResponse>;
  signup: (payload: LoginFields) => TypedResponse<LoginResponse>;
};

export interface LoginFields {
  email: string;
  password: string;
}

export interface JoinProfileInput {
  profileId: string;
  userId: string;
}

const addUsersApi = (instance: AxiosInstance): UsersApiType => ({
  ...buildBaseApi<UserProfile>(instance, '/api/profiles'),
  joinProfileAndUser: ({ profileId, ...payload }) =>
    instance.post<UserProfile>(`/api/profiles/join/${profileId}`, payload),
  login: (payload) => instance.post<LoginResponse>('/api/users/login', payload),
  signup: (payload) =>
    instance.post<LoginResponse>('/api/users/connect', payload)
});

export default addUsersApi;
