import { Attendance, AttendanceCategory } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import DateDisplay from '../date-display';

export const buildAttendanceColumns: (
  attendanceCategories: AttendanceCategory[]
) => OrderedColumnsType<Attendance> = (attendanceCategories) => [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    displayOrder: 1,
    render: (value: Attendance['date']) => <DateDisplay date={value} />
  },
  {
    title: 'Event',
    dataIndex: 'event',
    key: 'event',
    displayOrder: 2,
    render: (value: Attendance['event']) =>
      value && typeof value !== 'string' ? value.name : undefined
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    displayOrder: 3
  },
  {
    title: 'Categories',
    dataIndex: 'categories',
    key: 'categories',
    displayOrder: 4,
    render: (value: Attendance['categories']) =>
      value
        .filter((c) => c.count > 0)
        .map((c) => {
          const category = attendanceCategories.find(
            (x) => x._id === c.category
          );
          return `${category ? category.name : c.category} - ${c.count}`;
        })
        .join(', ')
  }
];
