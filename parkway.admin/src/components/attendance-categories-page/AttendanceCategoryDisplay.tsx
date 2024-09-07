import { AttendanceCategory } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import styles from './AttendanceDisplay.module.scss';

const AttendanceCategoryDisplay = (attendanceCategory: AttendanceCategory) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Description',
      children: attendanceCategory.description
    }
  ];

  return (
    <>
      <h3>{attendanceCategory.name}</h3>
      <Descriptions
        size="small"
        items={items}
        bordered
        column={1}
        className={styles.descriptions}
      />
    </>
  );
};

export default AttendanceCategoryDisplay;
