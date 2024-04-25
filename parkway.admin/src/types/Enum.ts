import { BaseEntity } from './BaseEntity.ts';

export type Enum = BaseEntity & {
  name: string;
  values: string[];
};
