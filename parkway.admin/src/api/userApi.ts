import { UserProfile } from '../types/UserProfile.ts';
import { LoginResponse } from '../hooks/useAuth.tsx';
import { TypedResponse } from '../hooks/useApi.ts';
import { AxiosInstance } from 'axios';

export type UsersApiType = {
  createUserProfile: (
    payload: Omit<UserProfile, '_id'>
  ) => TypedResponse<UserProfile>;
  getProfiles: () => TypedResponse<UserProfile[]>;
  login: (payload: LoginFields) => TypedResponse<LoginResponse>;
  signup: (payload: LoginFields) => TypedResponse<LoginResponse>;
};

export interface LoginFields {
  email: string;
  password: string;
}

const createUserProfile = (
  instance: AxiosInstance,
  payload: Omit<UserProfile, '_id'>
) => instance.post('/api/profile', payload);

const getProfiles = (instance: AxiosInstance) =>
  instance.get<UserProfile[]>('/api/profile');

const login = (instance: AxiosInstance, payload: LoginFields) =>
  instance.post<LoginResponse>('/api/user/login', payload);

const signup = (instance: AxiosInstance, payload: LoginFields) =>
  instance.post<LoginResponse>('/api/user/connect', payload);

const addUsersApi = (instance: AxiosInstance): UsersApiType => ({
  createUserProfile: (payload) => createUserProfile(instance, payload),
  getProfiles: () => getProfiles(instance),
  login: (payload) => login(instance, payload),
  signup: (payload) => signup(instance, payload)
});

export default addUsersApi;
