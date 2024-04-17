import { BaseEntity } from './BaseEntity.ts';

export type Event = BaseEntity & {
  name: string;
  description?: string;
  organizer?: string;
  start: Date;
  end: Date;
  location?: string;
  category?: string;
  status: EventStatus;
  teams: string[];
  approvedBy?: string;
  approvedDate?: Date;
};

export type EventStatus = 'Active' | 'Tentative' | 'Rejected';
