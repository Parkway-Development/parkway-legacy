import { BaseEntity } from './BaseEntity.ts';
import { UserProfile } from './UserProfile.ts';

export type Attendance = BaseEntity & {
  event: Event | string;
  createdBy: UserProfile | string;
  created: Date;
  total: number;
  categories: AttendanceDetail[];
};

type AttendanceDetail = {
  category: string;
  count: number;
};
