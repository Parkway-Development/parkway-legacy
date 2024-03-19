import { BaseEntity } from './BaseEntity.ts';

export type EventCategory = BaseEntity & {
  name: string;
  backgroundColor: string;
  fontColor: string;
};
