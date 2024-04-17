import styles from './EventStatus.module.css';
import { Button } from 'antd';
import { Event } from '../../types';
import { useState } from 'react';
import useApi from '../../hooks/useApi.ts';
import { useMutation } from '@tanstack/react-query';
import { ApproveEventPayload } from '../../api';

type EventStatusProps = {
  status: Event['status'];
  isCalendarAdmin: boolean;
  userId: string;
  eventId: string;
};

const EventStatus = ({
  status: initialStatus,
  isCalendarAdmin,
  userId,
  eventId
}: EventStatusProps) => {
  const [status, setStatus] = useState<Event['status']>(initialStatus);
  const {
    eventsApi: { approve }
  } = useApi();
  const { isPending: approvePending, mutate: performApprove } = useMutation({
    mutationFn: approve
  });

  const handleApproveClick = async () => {
    const payload: ApproveEventPayload = {
      _id: eventId,
      approvedBy: userId,
      approvedDate: new Date()
    };

    try {
      await performApprove(payload);
      setStatus('Active');
    } catch (e) {}
  };

  let approveButton = null;
  let rejectButton = null;

  if (isCalendarAdmin) {
    if (status !== 'Active') {
      approveButton = (
        <Button
          type="primary"
          loading={approvePending}
          onClick={handleApproveClick}
        >
          Approve
        </Button>
      );
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
