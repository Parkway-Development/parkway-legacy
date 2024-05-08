import { BaseEntity } from './BaseEntity.ts';
import { EventSchedule } from './EventSchedule.ts';

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
  rejectedBy?: string;
  rejectedDate?: Date;
  messages?: EventMessage[];
  schedule?: EventSchedule;
};

export type EventMessage = {
  profile: string;
  messageDate: Date;
  message: string;
};

export type EventStatus = 'Active' | 'Tentative' | 'Rejected';
