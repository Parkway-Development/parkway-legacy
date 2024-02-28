import { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAuth } from './useAuth.tsx';

const createInstance = (token: string | undefined) =>
  axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    },
    baseURL: import.meta.env.VITE_API_URL
  });

const handleError = (
  err: unknown,
  logout: () => void,
  setError: (errorMessage: string | undefined) => void
) => {
  if (err instanceof AxiosError) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      logout();
      return;
    }

    const message = err.response?.data?.err;
    if (message) {
      setError(message);
      return;
    }
  }

  setError('Unexpected error');
};

export const useGet = <TResult>(url: string) => {
  const { token, logout } = useAuth();
  const [data, setData] = useState<TResult>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const instance = createInstance(token);
        const { data } = await instance.get<TResult>(url);
        setData(data);
      } catch (err) {
        handleError(err, logout, setError);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [url]);

  return { data, error, loading, setData };
};

type mutationMethods = 'post' | 'put' | 'patch' | 'delete';

export const useMutation = <TResult>(url: string) => {
  const { token, logout } = useAuth();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const fetchData = async (
    method: mutationMethods,
    payload: unknown = undefined
  ) => {
    setLoading(true);
    setError(undefined);

    let response: AxiosResponse<TResult> | undefined = undefined;
    const instance = createInstance(token);

    try {
      if (method === 'post') {
        response = await instance.post<TResult>(url, payload);
      } else if (method === 'put') {
        response = await instance.put<TResult>(url, payload);
      } else if (method === 'patch') {
        response = await instance.patch<TResult>(url, payload);
      } else if (method === 'delete') {
        response = await instance.delete<TResult>(url);
      }

      return response;
    } catch (err) {
      handleError(err, logout, setError);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    post: (payload: unknown): Promise<AxiosResponse<TResult> | undefined> =>
      fetchData('post', payload),
    put: (payload: unknown): Promise<AxiosResponse<TResult> | undefined> =>
      fetchData('put', payload),
    patch: (payload: unknown): Promise<AxiosResponse<TResult> | undefined> =>
      fetchData('patch', payload),
    deleteCall: (): Promise<AxiosResponse<TResult> | undefined> =>
      fetchData('delete')
  };
};
