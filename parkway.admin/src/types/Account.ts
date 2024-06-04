import { BaseEntity } from './BaseEntity.ts';
import { UserProfile } from './UserProfile.ts';

export type Account = BaseEntity & {
  name: string;
  description?: string;
  type: string;
  subtype: string;
  parent?: Account;
  children?: Account[];
  custodian?: string | UserProfile;
  notes?: string[];
};
