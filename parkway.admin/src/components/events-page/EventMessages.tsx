import { EventMessage } from '../../types';
import { ReactNode, useState } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import { Alert, Button } from 'antd';
import styles from './EventMessages.module.css';
import useApi, { buildQueryKey } from '../../hooks/useApi.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth.tsx';
import { AddEventMessagePayload } from '../../api';
import { UserNameDisplay } from '../user-name-display';
import DateDisplay from '../date-display';

interface EventMessagesProps {
  eventId: string;
  messages?: EventMessage[];
}

const EventMessages = ({
  eventId,
  messages: propMessages
}: EventMessagesProps) => {
  const [messages, setMessages] = useState<EventMessage[]>(propMessages ?? []);
  const [text, setText] = useState<string>('');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    eventsApi: { addMessage },
    formatError
  } = useApi();

  const { error, isPending, mutate } = useMutation({
    mutationFn: addMessage
  });

  let content: ReactNode;

  if (messages.length) {
    content = (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>By</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message, index) => {
            return (
              <tr key={index}>
                <td>
                  <DateDisplay date={message.messageDate} displayTime />
                </td>
                <td>
                  <UserNameDisplay user={message.profile} />
                </td>
                <td>{message.message}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  } else {
    content = <p>No current messages</p>;
  }

  const handleAddMessage = () => {
    const payload: AddEventMessagePayload = {
      _id: eventId,
      profile: user!.profileId!,
      message: text,
      messageDate: new Date()
    };

    mutate(payload, {
      onSuccess: (response) => {
        queryClient.setQueryData(buildQueryKey('events', eventId), response);
        if (response && response.data.messages) {
          setMessages(response.data.messages);
        }
        setText('');
      }
    });
  };

  return (
    <div id="eventMessages" className={styles.eventMessages}>
      <h3>Event Messages</h3>
      {content}
      <h4>New Message</h4>
      <TextArea onChange={(e) => setText(e.currentTarget.value)} value={text} />
      {error && <Alert type="error" message={formatError(error)} />}
      <Button
        type="primary"
        onClick={handleAddMessage}
        loading={isPending}
        disabled={!text || text.trim().length === 0 || isPending}
      >
        Add Message
      </Button>
    </div>
  );
};

export default EventMessages;
