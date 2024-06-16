import { Attendance } from '../../types';
import { Descriptions, DescriptionsProps, Table } from 'antd';
import { AttendanceEntry } from '../../types/AttendanceEntry.ts';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';
import DateDisplay from '../date-display';
import styles from './AttendanceDisplay.module.scss';
import NumberFormat from '../number-format';

const sampleEntries: AttendanceEntry[] = [
  {
    _id: '1',
    date: new Date(2024, 5, 16),
    attendance: '1234',
    count: 100
  },
  {
    _id: '2',
    date: new Date(2024, 5, 9),
    attendance: '1234',
    count: 2314
  },
  {
    _id: '3',
    date: new Date(2024, 5, 2),
    attendance: '1234',
    count: 987
  }
];

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
      <Descriptions size="small" items={items} bordered column={1} />
      <EntriesTable entries={sampleEntries} />
    </>
  );
};

type EntriesTableProps = {
  entries: AttendanceEntry[];
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

const EntriesTable = ({ entries }: EntriesTableProps) => {
  let content;

  if (entries.length === 0) {
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
