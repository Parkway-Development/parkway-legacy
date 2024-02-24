import { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

export const useGet = <TResult>(url: string) => {
  const [data, setData] = useState<TResult>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const { data } = await axios.get<TResult>(url);
        setData(data);
      } catch (err) {
        if (err instanceof AxiosError) {
          const message = err.response?.data?.err;
          if (message) {
            setError(message);
            return;
          }
        }

        setError('Unexpected error fetching data');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [url]);

  return { data, error, loading };
};

type mutationMethods = 'post' | 'put' | 'patch' | 'delete';

export const useMutation = <TResult>(url: string) => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const fetchData = async (
    method: mutationMethods,
    payload: unknown = undefined
  ) => {
    setLoading(true);
    setError(undefined);

    let response: AxiosResponse<TResult> | undefined = undefined;

    try {
      if (method === 'post') {
        response = await axios.post<TResult>(url, payload);
      } else if (method === 'put') {
        response = await axios.put<TResult>(url, payload);
      } else if (method === 'patch') {
        response = await axios.patch<TResult>(url, payload);
      } else if (method === 'delete') {
        response = await axios.delete<TResult>(url);
      }

      return response;
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data?.err;
        if (message) {
          setError(message);
          return;
        }
      }

      setError('Unexpected error');
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
    delete: (): Promise<AxiosResponse<TResult> | undefined> =>
      fetchData('delete')
  };
};
