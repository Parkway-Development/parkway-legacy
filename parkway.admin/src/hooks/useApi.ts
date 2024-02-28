import { useAuth } from './useAuth.tsx';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export type GenericResponse = Promise<AxiosResponse<any, any>>;

type ApiType = {
  deleteTeam: (id: string) => GenericResponse;
};

const createInstance = (token: string | undefined) =>
  axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    },
    baseURL: import.meta.env.VITE_API_URL
  });

const deleteTeam = (instance: AxiosInstance, id: string): GenericResponse =>
  instance.delete(`/api/team/${id}`);

const useApi: () => ApiType = () => {
  const { token } = useAuth();

  const instance = createInstance(token);

  return {
    deleteTeam: (id) => deleteTeam(instance, id)
  };
};

export default useApi;
