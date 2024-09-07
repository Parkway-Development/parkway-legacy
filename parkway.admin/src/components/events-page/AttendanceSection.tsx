import { useQueries } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { Alert, Button, Spin } from 'antd';
import { Link } from 'react-router-dom';
import styles from './AttendanceSection.module.scss';

type AttendanceSectionProps = {
  eventId: string;
};

const AttendanceSection = ({ eventId }: AttendanceSectionProps) => {
  const {
    attendanceApi: { getByEventId },
    attendanceCategoryApi: { getAll: getAttendanceCategories },
    formatError
  } = useApi();

  const [attendance, categories] = useQueries({
    queries: [
      {
        queryFn: () => getByEventId(eventId),
        queryKey: buildQueryKey('attendance', eventId)
      },
      {
        queryFn: getAttendanceCategories,
        queryKey: buildQueryKey('attendanceCategory')
      }
    ]
  });

  const error = attendance.error ?? categories.error;
  const isLoading = attendance.isLoading ?? categories.isLoading;

  if (error) {
    return <Alert type="error" message={formatError(error)} />;
  }

  if (isLoading) {
    return <Spin />;
  }

  const detail = attendance.data?.data;

  if (!detail) {
    return (
      <div className={styles.attendanceSection}>
        <Link to={`/attendance/add/${eventId}`}>
          <Button>Add Attendance</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.attendanceSection}>
      <Link to={`/attendance/${detail._id}/edit`}>
        <Button>Edit Attendance</Button>
      </Link>
      <span>Total Attendance: {detail.total}</span>
      <span>
        {detail.categories.map((category, index) => {
          const existingCategory = categories.data?.data.find(
            (x) => x._id === category.category
          );
          return (
            <>
              {index > 0 && <span> | </span>}
              <span key={category.category}>
                {existingCategory?.name ?? category.category}: {category.count}
              </span>
            </>
          );
        })}
      </span>
    </div>
  );
};

export default AttendanceSection;
