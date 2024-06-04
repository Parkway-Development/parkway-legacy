import { BaseEntity } from './BaseEntity.ts';

export type EventSchedule = BaseEntity & {
  frequency: 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  week_days?: number[];
  month?: number;
  month_days?: number[];
  month_weeks?: number[];
  start_date: Date;
  last_schedule_date: Date;
  end_date?: Date;
};
