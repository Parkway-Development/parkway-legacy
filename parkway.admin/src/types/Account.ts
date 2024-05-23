import { BaseEntity } from './BaseEntity.ts';

export type Account = BaseEntity & {
  name: string;
  description?: string;
  type: string;
  subtype: string;
  parent?: Account;
  children?: Account[];
  custodian?: string;
  notes?: string[];
};
