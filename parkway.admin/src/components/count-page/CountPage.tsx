import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useMutation } from '@tanstack/react-query';
import useApi from '../../hooks/useApi.ts';

const CountPage = () => {
  const [currentCount, setCurrentCount] = useState<number>(0);
  const {
    generalApi: { count }
  } = useApi();

  const { mutate } = useMutation({
    mutationFn: count
  });

  useEffect(() => {
    const socket = io('ws://127.0.0.1:3000', {
      transports: ['websocket']
    });

    socket.on('connect', () => {
      console.log('client connected');
    });

    socket.on('disconnect', () => {
      console.log('client disconnected');
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
