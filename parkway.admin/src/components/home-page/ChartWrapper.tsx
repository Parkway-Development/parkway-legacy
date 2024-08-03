import useApi from '../../hooks/useApi.tsx';
import { ReactNode } from 'react';
import { Alert, Spin } from 'antd';
import styles from './ChartWrapper.module.css';

type ChartWRapperProps = {
  title: string;
  loading: boolean;
  error: Error | null;
  children: React.ReactNode;
};

const ChartWrapper = ({
  title,
  loading,
  error,
  children
}: ChartWRapperProps) => {
  const { formatError } = useApi();

  let content: ReactNode;

  if (error) {
    content = <Alert type="error" message={formatError(error)} />;
  } else if (loading) {
    content = <Spin />;
  } else {
    content = children;
  }

  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      {content}
    </div>
  );
};

export default ChartWrapper;
