import { Attendance } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';

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
    </>
  );
};

export default AttendanceDisplay;
