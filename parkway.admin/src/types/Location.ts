import { BaseEntity } from './BaseEntity.ts';
import { Address } from './UserProfile.ts';

export type Location = BaseEntity & {
  name: string;
  description?: string;
  address: Address;
};
