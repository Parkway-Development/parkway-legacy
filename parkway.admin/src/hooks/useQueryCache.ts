import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

type UseQueryCacheProps<T> = {
  cacheKey: string;
  initialValue: T;
};

const useQueryCache = <T>({
  cacheKey,
  initialValue
}: UseQueryCacheProps<T>): [T | undefined, (newValue: T) => void] => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [cacheKey],
    initialData: initialValue
  });

  const updateCache = useCallback(
    (newValue: T) => {
      queryClient.setQueryData([cacheKey], newValue);
    },
    [queryClient, cacheKey]
  );

  return [data, updateCache];
};

export default useQueryCache;
