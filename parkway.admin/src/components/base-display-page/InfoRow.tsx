import styles from './InfoRow.module.css';
import { ReactNode } from 'react';

export const InfoRow = ({
  label,
  value
}: {
  label: string;
  value?: ReactNode;
}) => {
  return (
    <div className={styles.infoRow}>
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
};
