import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import AttendanceForm from './AttendanceForm.tsx';
import { buildAttendanceColumns } from './columns.tsx';
import AttendanceDisplay from './AttendanceDisplay.tsx';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { AttendanceCategory } from '../../types';
import DateDisplay from '../date-display';

const sharedProps: SharedBasePageProps = {
  queryKey: 'attendance',
  baseApiType: 'attendanceApi',
  mainPage: '/attendance'
};

const AttendancesPage = () => {
  const {
    attendanceCategoryApi: { getAll }
  } = useApi();

  const { data, isLoading } = useQuery({
    queryKey: buildQueryKey('attendanceCategory'),
    queryFn: getAll
  });

  if (isLoading) return <Spin />;

  const categories: AttendanceCategory[] = data?.data ?? [];

  return (
    <BaseApiDataTablePage
      {...sharedProps}
      columns={buildAttendanceColumns(categories)}
      title="Attendance"
      subtitle="New attendance values can be added from event details pages"
      responsiveCardRenderer={(item) => <DateDisplay date={item.date} />}
      allowAdd={false}
    />
  );
};

const AttendancePage = () => (
  <BaseDisplayPage {...sharedProps} render={AttendanceDisplay} />
);

const AddAttendancePage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={AttendanceForm} />
);

const EditAttendancePage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={AttendanceForm} />
);

export {
  AddAttendancePage,
  EditAttendancePage,
  AttendancesPage,
  AttendancePage
};
