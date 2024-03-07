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

const buildGeneralApi = (instance: AxiosInstance): GeneralApiType => ({
  getPasswordSettings: () =>
    instance.get<PasswordSettings>('/api/setting/password')
});

export default buildGeneralApi;
