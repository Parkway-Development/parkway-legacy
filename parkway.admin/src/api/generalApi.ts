import { GenericResponse, TypedResponse } from '../hooks/useApi.ts';
import { AxiosInstance } from 'axios';

export type GeneralApiType = {
  getPasswordSettings: () => TypedResponse<PasswordSettings>;
  count: (count: number) => GenericResponse;
};

export interface PasswordSettings {
  minimumLength: number;
  minimumLowercase: number;
  minimumUppercase: number;
  minimumNumbers: number;
  minimumSymbols: number;
}

export const buildGeneralApi = (instance: AxiosInstance): GeneralApiType => ({
  getPasswordSettings: () =>
    instance.get<PasswordSettings>('/api/settings/password'),
  count: (count) => instance.post('/api/count', { count })
});
