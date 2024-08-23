import { BaseEntity } from './BaseEntity.ts';

export type AttendanceCategory = BaseEntity & {
  name: string;
  description?: string;
};
