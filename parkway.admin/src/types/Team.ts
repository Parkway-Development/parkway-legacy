import { BaseEntity } from './BaseEntity.ts';

export type Team = BaseEntity & {
  name: string;
  description?: string;
  leader?: string;
  members: string[];
};
