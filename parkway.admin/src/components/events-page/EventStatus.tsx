import styles from './EventStatus.module.css';
import { Button } from 'antd';
import { Event } from '../../types';
import { useState } from 'react';

type EventStatusProps = {
  status: Event['status'];
  isCalendarAdmin: boolean;
};

const EventStatus = ({
  status: initialStatus,
  isCalendarAdmin
}: EventStatusProps) => {
  // @ts-ignore
  const [status, setStatus] = useState<Event['status']>(initialStatus);

  let approveButton = null;
  let rejectButton = null;

  if (isCalendarAdmin) {
    if (status !== 'Active') {
      approveButton = <Button type="primary">Approve</Button>;
    }

    if (status !== 'Rejected') {
      rejectButton = <Button danger>Reject</Button>;
    }
  }

  return (
    <div>
      <div className={styles.statusLine}>
        <span>{status}</span>
        {approveButton}
        {rejectButton}
      </div>
    </div>
  );
};

export default EventStatus;
