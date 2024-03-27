import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useMutation } from '@tanstack/react-query';
import useApi from '../../hooks/useApi.ts';
import { useAuth } from '../../hooks/useAuth.tsx';

const CountPage = () => {
  const { token } = useAuth();
  const [currentCount, setCurrentCount] = useState<number>(0);
  const {
    generalApi: { count }
  } = useApi();

  const { mutate } = useMutation({
    mutationFn: count
  });

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_WS_URL, {
      auth: { token },
      transports: ['websocket']
    });

    socket.on('count', (newCount) => {
      setCurrentCount(newCount);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onIncrease = () => mutate(currentCount + 1);

  return (
    <>
      <h2>Count Page</h2>
      <p>Current Count: {currentCount}</p>
      <Button onClick={onIncrease}>Increase</Button>
    </>
  );
};

export default CountPage;
