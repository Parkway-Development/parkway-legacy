import { BaseEntity } from './BaseEntity.ts';

export type Attendance = BaseEntity & {
  name: string;
  description?: string;
};
