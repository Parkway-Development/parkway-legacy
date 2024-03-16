import { BaseEntity } from './BaseEntity.ts';

export type Event = BaseEntity & {
  name: string;
  description?: string;
  organizer?: string;
  start: Date;
  end: Date;
  location?: string;
  category?: string;
  status: string;
};
