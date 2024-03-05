import { UserProfile } from '../types/UserProfile.ts';
import { LoginResponse } from '../hooks/useAuth.tsx';
import { GenericResponse, TypedResponse } from '../hooks/useApi.ts';
import { AxiosInstance } from 'axios';

export type UsersApiType = {
  createUserProfile: (
    payload: Omit<UserProfile, '_id'>
  ) => TypedResponse<UserProfile>;
  deleteUserProfile: (id: string) => GenericResponse;
  getUserProfileById: (id: string) => () => TypedResponse<UserProfile>;
  getUserProfiles: () => TypedResponse<UserProfile[]>;
  joinProfileAndUser: (payload: JoinProfileInput) => TypedResponse<UserProfile>;
  login: (payload: LoginFields) => TypedResponse<LoginResponse>;
  signup: (payload: LoginFields) => TypedResponse<LoginResponse>;
  updateUserProfile: (payload: UserProfile) => TypedResponse<UserProfile>;
};

export interface LoginFields {
  email: string;
  password: string;
}

export interface JoinProfileInput {
  profileId: string;
  userId: string;
}

const createUserProfile = (
  instance: AxiosInstance,
  payload: Omit<UserProfile, '_id'>
) => instance.post('/api/profile', payload);

const deleteUserProfile = (instance: AxiosInstance, id: string) =>
  instance.delete(`/api/profile/${id}`);

const getUserProfiles = (instance: AxiosInstance) =>
  instance.get<UserProfile[]>('/api/profile');

const getUserProfileById = (instance: AxiosInstance, id: string) =>
  instance.get<UserProfile>(`/api/profile/id/${id}`);

const joinProfileAndUser = (
  instance: AxiosInstance,
  { profileId, ...payload }: JoinProfileInput
) => instance.post<UserProfile>(`/api/profile/join/${profileId}`, payload);

const login = (instance: AxiosInstance, payload: LoginFields) =>
  instance.post<LoginResponse>('/api/user/login', payload);

const signup = (instance: AxiosInstance, payload: LoginFields) =>
  instance.post<LoginResponse>('/api/user/connect', payload);

const updateUserProfile = (
  instance: AxiosInstance,
  { _id, ...payload }: UserProfile
) => {
  return instance.patch(`/api/profile/${_id}`, payload);
};

const addUsersApi = (instance: AxiosInstance): UsersApiType => ({
  createUserProfile: (payload) => createUserProfile(instance, payload),
  deleteUserProfile: (id) => deleteUserProfile(instance, id),
  getUserProfiles: () => getUserProfiles(instance),
  getUserProfileById: (id) => () => getUserProfileById(instance, id),
  joinProfileAndUser: (payload) => joinProfileAndUser(instance, payload),
  login: (payload) => login(instance, payload),
  signup: (payload) => signup(instance, payload),
  updateUserProfile: (payload) => updateUserProfile(instance, payload)
});

export default addUsersApi;
