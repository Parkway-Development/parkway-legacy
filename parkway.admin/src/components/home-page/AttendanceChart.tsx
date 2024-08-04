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
import { useQueries } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { GetAttendanceEntriesByDateRangeInput } from '../../api';
import { addWeeks, isBefore } from 'date-fns';
import ChartWrapper from './ChartWrapper.tsx';
import { Attendance } from '../../types';
import { getFillColor } from '../../utilities/charts.ts';

const AttendanceChart = () => {
  const [getAttendanceEntriesByDateRangeInput] =
    useState<GetAttendanceEntriesByDateRangeInput>(() => {
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
    attendanceApi: { getAttendanceEntriesByDateRange, getAll }
  } = useApi();

  const [attendances, entries] = useQueries({
    queries: [
      {
        queryKey: buildQueryKey('attendance'),
        queryFn: () => getAll(),
        enabled: hasAccess
      },
      {
        queryKey: buildQueryKey('attendanceEntry', 'chartDisplay'),
        queryFn: () =>
          getAttendanceEntriesByDateRange(getAttendanceEntriesByDateRangeInput),
        enabled: hasAccess
      }
    ]
  });

  const isLoading = [attendances, entries].some((query) => query.isLoading);
  const error = [attendances, entries].reduce(
    (previous: Error | null, query) => (previous ? previous : query.error),
    null
  );

  interface GroupedData {
    date: string;
    dateValue: Date;
    [key: string]: number | string | Date;
  }

  const { chartData, attendancesToDisplay } = useMemo(() => {
    let chartData = undefined;
    let attendancesToDisplay: Attendance[] = [];

    if (
      attendances.data?.data &&
      attendances.data?.data.length &&
      entries.data?.data &&
      entries.data?.data.length
    ) {
      attendancesToDisplay = attendances.data.data.filter((x) =>
        entries.data.data.some((e) => x._id === e.attendance)
      );

      const groupedByDate = entries.data.data.reduce(
        (acc, item) => {
          const date = item.date.toLocaleDateString();

          if (!acc[date]) {
            acc[date] = { date, dateValue: item.date };
          }

          acc[date][item.attendance] = item.count;

          return acc;
        },
        {} as Record<string, GroupedData>
      );

      chartData = Object.values(groupedByDate).sort((a, b) =>
        isBefore(a.dateValue, b.dateValue) ? -1 : 1
      );
    }

    return {
      chartData,
      attendancesToDisplay
    };
  }, [attendances.data?.data, entries.data?.data]);

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
          {attendancesToDisplay.map((a, index) => (
            <Bar
              key={a._id}
              dataKey={a._id}
              name={a.name}
              fill={getFillColor(index)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default AttendanceChart;
