import { BaseEntity } from './BaseEntity.ts';

export type AttendanceEntry = BaseEntity & {
  date: Date;
  notes?: string;
  attendance: string;
  count: number;
};
