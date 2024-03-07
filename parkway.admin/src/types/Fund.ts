import { BaseEntity } from './BaseEntity.ts';

export type Fund = BaseEntity & {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  notes?: string;
};
