import { useAuth } from '../../hooks/useAuth.tsx';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { GetDepositsByDateRangeInput } from '../../api';
import { addWeeks } from 'date-fns';
import { formatPennies } from '../money-display/MoneyDisplay.tsx';
import ChartWrapper from './ChartWrapper.tsx';

const DepositsChart = () => {
  const [getDepositsInput] = useState<GetDepositsByDateRangeInput>(() => {
    const now = new Date();
    const twoWeeksAgo = addWeeks(now, -2);

    return {
      startDate: twoWeeksAgo,
      endDate: now
    };
  });

  const { hasClaim } = useAuth();
  const hasAccess = hasClaim('accounting');
  const {
    depositsApi: { getDepositsByDateRange }
  } = useApi();

  const { data, isLoading, error } = useQuery({
    queryKey: buildQueryKey('deposits', 'chartDisplay'),
    queryFn: () => getDepositsByDateRange(getDepositsInput),
    enabled: hasAccess
  });

  const chartData = useMemo(() => {
    if (!data || !data.data || !data.data.length) return undefined;

    return data.data.map((deposit) => ({
      created: deposit.createdAt.toLocaleDateString(),
      amount: deposit.amount
    }));
  }, [data]);

  if (!hasAccess) {
    return null;
  }

  return (
    <ChartWrapper title="Deposits" loading={isLoading} error={error}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid />
          <XAxis dataKey="created" />
          <YAxis tickFormatter={(value) => `$${value / 100}`} />
          <Tooltip formatter={(value: number) => formatPennies(value)} />
          <Legend />
          <Bar dataKey="amount" name="Amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default DepositsChart;
