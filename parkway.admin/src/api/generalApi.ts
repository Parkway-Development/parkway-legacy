import { TypedResponse } from '../hooks/useApi.ts';
import { AxiosInstance } from 'axios';

export interface GeneralApiType {
  getPasswordSettings: () => TypedResponse<PasswordSettings>;
  getOrganizationId: () => TypedResponse<string>;
}

export interface PasswordSettings {
  minimumLength: number;
  minimumLowercase: number;
  minimumUppercase: number;
  minimumNumbers: number;
  minimumSymbols: number;
}

export const buildGeneralApi = (instance: AxiosInstance): GeneralApiType => ({
  getPasswordSettings: () =>
    instance.get<PasswordSettings>('/settings/password'),
  getOrganizationId: () => instance.get<string>('/organizations/lookup')
});
