import { Attendance } from '../../types';
import { Alert, Descriptions, DescriptionsProps, Spin, Table } from 'antd';
import { AttendanceEntry } from '../../types/AttendanceEntry.ts';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import DateDisplay from '../date-display';
import styles from './AttendanceDisplay.module.scss';
import NumberFormat from '../number-format';
import AddEntryModal from './AddEntryModal.tsx';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQuery } from '@tanstack/react-query';

const AttendanceDisplay = (attendance: Attendance) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Description',
      children: attendance.description
    }
  ];

  return (
    <>
      <h3>{attendance.name}</h3>
      <Descriptions
        size="small"
        items={items}
        bordered
        column={1}
        className={styles.descriptions}
      />
      <AddEntryModal attendanceId={attendance._id} />
      <EntriesTable attendanceId={attendance._id} />
    </>
  );
};

type EntriesTableProps = {
  attendanceId: string;
};

const entriesColumns: OrderedColumnsType<AttendanceEntry> = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    displayOrder: 1,
    width: 100,
    render: (value: AttendanceEntry['date']) => <DateDisplay date={value} />
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
    width: 100,
    align: 'end',
    displayOrder: 2,
    render: (value: AttendanceEntry['count']) => <NumberFormat value={value} />
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
    displayOrder: 3
  }
];

const EntriesTable = ({ attendanceId }: EntriesTableProps) => {
  const {
    attendanceApi: { getEntries },
    formatError
  } = useApi();
  const { data, isLoading, error } = useQuery({
    queryKey: buildQueryKey('attendanceEntry', attendanceId),
    queryFn: () => getEntries(attendanceId)
  });

  let content;
  const entries = data?.data ?? [];

  if (isLoading) {
    return <Spin />;
  } else if (error) {
    return <Alert type="error" message={formatError(error)} />;
  } else if (entries.length === 0) {
    content = <span>No attendance entries yet.</span>;
  } else {
    content = (
      <Table
        columns={entriesColumns}
        dataSource={entries}
        rowKey="_id"
        size="small"
      />
    );
  }

  return (
    <div className={styles.entries}>
      <h3>Entries</h3>
      {content}
    </div>
  );
};

export default AttendanceDisplay;
