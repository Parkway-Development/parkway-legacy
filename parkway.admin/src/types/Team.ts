import { BaseEntity } from './BaseEntity.ts';

export type Team = BaseEntity & {
  _id: string;
  name: string;
  description?: string;
  leaderId?: string;
  members: string[];
};
