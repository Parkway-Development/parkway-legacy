import { BaseEntity } from './BaseEntity.ts';

export type EventRegistration = BaseEntity & {
  event: string;
  profile: string;
  created: Date;
  registrationSlots: string[];
};
