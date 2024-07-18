import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { isDateString } from '../utilities';
import { parseISO } from 'date-fns';

const useDateQueryParam = () => {
  const [searchParams] = useSearchParams();

  const dateParam = searchParams.get('date');

  return useMemo(() => {
    if (!dateParam) return undefined;
    if (!isDateString(dateParam)) return undefined;
    return parseISO(dateParam);
  }, [dateParam]);
};

export default useDateQueryParam;
