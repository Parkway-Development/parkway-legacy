import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import AttendanceCategoryForm from './AttendanceCategoryForm.tsx';
import { attendanceCategoryColumns } from './columns.tsx';
import AttendanceCategoryDisplay from './AttendanceCategoryDisplay.tsx';

const sharedProps: SharedBasePageProps = {
  queryKey: 'attendanceCategory',
  baseApiType: 'attendanceApi',
  mainPage: '/attendance-categories'
};

const AttendancesCategoriesPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={attendanceCategoryColumns}
    title="Attendance Categories"
    addLinkTitle="Add New"
    responsiveCardRenderer={(item) => item.name}
  />
);

const AttendanceCategoriesPage = () => (
  <BaseDisplayPage {...sharedProps} render={AttendanceCategoryDisplay} />
);

const AddAttendanceCategoryPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={AttendanceCategoryForm} />
);

const EditAttendanceCategoryPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={AttendanceCategoryForm} />
);

export {
  AddAttendanceCategoryPage,
  EditAttendanceCategoryPage,
  AttendancesCategoriesPage,
  AttendanceCategoriesPage
};
