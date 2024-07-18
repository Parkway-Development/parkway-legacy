import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import AttendanceForm from './AttendanceForm.tsx';
import { attendanceColumns } from './columns.tsx';
import AttendanceDisplay from './AttendanceDisplay.tsx';

const sharedProps: SharedBasePageProps = {
  queryKey: 'attendance',
  baseApiType: 'attendanceApi',
  mainPage: '/attendance'
};

const AttendancesPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={attendanceColumns}
    title="Attendance"
    addLinkTitle="Add New"
    responsiveCardRenderer={(item) => item.name}
  />
);

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
