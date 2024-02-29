import { TypedResponse } from '../hooks/useApi.ts';
import { AxiosInstance } from 'axios';

export type GeneralApiType = {
  getPasswordSettings: () => TypedResponse<PasswordSettings>;
};

export interface PasswordSettings {
  minimumLength: number;
  minimumLowercase: number;
  minimumUppercase: number;
  minimumNumbers: number;
  minimumSymbols: number;
}

const getPasswordSettings = (instance: AxiosInstance) =>
  instance.get<PasswordSettings>('/api/setting/password');

const addGeneralApi = (instance: AxiosInstance): GeneralApiType => ({
  getPasswordSettings: () => getPasswordSettings(instance)
});

export default addGeneralApi;
