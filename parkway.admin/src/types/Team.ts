import { BaseEntity } from './BaseEntity.ts';

export type Team = BaseEntity & {
  _id: string;
  name: string;
  description?: string;
  leader?: string;
  members: string[];
};
