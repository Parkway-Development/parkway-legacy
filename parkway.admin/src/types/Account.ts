import { BaseEntity } from './BaseEntity.ts';

export type Account = BaseEntity & {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  notes?: string[];
};
