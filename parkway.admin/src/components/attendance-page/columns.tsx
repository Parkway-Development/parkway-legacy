import { AttendanceCategory } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';

export const attendanceColumns: OrderedColumnsType<AttendanceCategory> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    displayOrder: 1
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    displayOrder: 2
  }
];
