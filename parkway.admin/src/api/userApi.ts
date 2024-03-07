import { UserProfile } from '../types/UserProfile.ts';
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
  ...buildBaseApi<UserProfile>(instance, '/api/profile'),
  joinProfileAndUser: ({ profileId, ...payload }) =>
    instance.post<UserProfile>(`/api/profile/join/${profileId}`, payload),
  login: (payload) => instance.post<LoginResponse>('/api/user/login', payload),
  signup: (payload) =>
    instance.post<LoginResponse>('/api/user/connect', payload)
});

export default addUsersApi;
