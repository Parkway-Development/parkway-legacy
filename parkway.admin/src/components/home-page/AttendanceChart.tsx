import { useAuth } from '../../hooks/useAuth.tsx';
import { Attendance } from '../../types';
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
import { GetAttendancesByDateRangeInput } from '../../api';
import { addWeeks, isBefore } from 'date-fns';
import ChartWrapper from './ChartWrapper.tsx';
import { getFillColor } from '../../utilities/charts.ts';

interface GroupedData {
  date: string;
  dateValue: Date;
  [key: string]: number | string | Date;
}

const AttendanceChart = () => {
  const [attendancesByDateRangeInput] =
    useState<GetAttendancesByDateRangeInput>(() => {
      const now = new Date();
      const twoWeeksAgo = addWeeks(now, -2);

      return {
        startDate: twoWeeksAgo,
        endDate: now
      };
    });

  const { hasClaim } = useAuth();
  const hasAccess = hasClaim('attendance');
  const {
    attendanceApi: { getAttendanceEntriesByDateRange }
  } = useApi();

  const { data, isLoading, error } = useQuery({
    queryKey: buildQueryKey('attendance', 'homechart'),
    queryFn: () => getAttendanceEntriesByDateRange(attendancesByDateRangeInput),
    enabled: hasAccess
  });

  const { chartData, eventsToDisplay } = useMemo(() => {
    let chartData = undefined;
    let eventsToDisplay: string[] = [];

    if (data?.data && data.data.length) {
      eventsToDisplay = data.data.reduce(
        (result: string[], value: Attendance) => {
          const eventName =
            value.event && typeof value.event !== 'string'
              ? value.event.name
              : undefined;

          if (eventName && !result.includes(eventName)) result.push(eventName);

          return result;
        },
        []
      );

      const groupedByDate = data.data.reduce(
        (acc, item) => {
          const date = item.date.toLocaleDateString();

          const eventName =
            item.event && typeof item.event !== 'string'
              ? item.event.name
              : undefined;

          if (!eventName) return acc;

          if (!acc[date]) {
            acc[date] = { date, dateValue: item.date };
          }

          acc[date][eventName] = item.total;

          return acc;
        },
        {} as Record<string, GroupedData>
      );

      chartData = Object.values(groupedByDate).sort((a, b) =>
        isBefore(a.dateValue, b.dateValue) ? -1 : 1
      );
    }

    return { chartData, eventsToDisplay };
  }, [data?.data]);

  if (!hasAccess) {
    return null;
  }

  return (
    <ChartWrapper
      title="Attendance"
      loading={isLoading}
      error={error}
      data={chartData}
    >
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {eventsToDisplay.map((x, index) => (
            <Bar key={x} dataKey={x} name={x} fill={getFillColor(index)} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default AttendanceChart;
