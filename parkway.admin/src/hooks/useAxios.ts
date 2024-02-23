import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

type methods = 'get' | 'post' | 'put' | 'patch' | 'delete';

const useAxios = <TResult>(
  url: string,
  method: methods = 'get',
  payload: unknown = undefined
) => {
  const [data, setData] = useState<TResult>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let response;
        if (method === 'get') {
          response = await axios.get<TResult>(url);
        } else if (method === 'post') {
          response = await axios.post<TResult>(url, payload);
        } else if (method === 'put') {
          response = await axios.put<TResult>(url, payload);
        } else if (method === 'patch') {
          response = await axios.patch<TResult>(url, payload);
        } else if (method === 'delete') {
          response = await axios.delete<TResult>(url);
        }

        if (response) {
          setData(response.data);
        }

        setError(undefined);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.message);
        } else {
          setError('Error processing data');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [url, method, payload]);

  return { data, error, loading };
};

export default useAxios;
