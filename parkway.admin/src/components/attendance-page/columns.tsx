import { Attendance } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import { Link } from 'react-router-dom';

export const attendanceColumns: OrderedColumnsType<Attendance> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    displayOrder: 1,
    render: (value: Attendance['name'], attendance) => (
      <Link to={`/attendance/${attendance._id}`}>{value}</Link>
    )
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    displayOrder: 2
  }
];
