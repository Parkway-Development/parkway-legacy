import { useEffect, useState } from 'react';
import axios from 'axios';

type methods = 'get' | 'post' | 'put' | 'patch' | 'delete';

const useAxios = <T>(
  url: string,
  method: methods = 'get',
  payload: any = null
) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let response;
        if (method === 'get') {
          response = await axios.get<T>(url);
        } else if (method === 'post') {
          response = await axios.post<T>(url, payload);
        } else if (method === 'put') {
          response = await axios.put<T>(url, payload);
        } else if (method === 'patch') {
          response = await axios.patch<T>(url, payload);
        } else if (method === 'delete') {
          response = await axios.delete<T>(url, payload);
        }

        if (response) {
          setData(response.data);
        }

        setError(undefined);
      } catch (err: any) {
        setError(err.message ?? err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, method, payload]);

  return { data, error, loading };
};

export default useAxios;
