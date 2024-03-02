import { BaseEntity } from './BaseEntity.ts';

export type UserProfile = BaseEntity & {
  firstname: string;
  lastname: string;
  middleinitial?: string;
  nickname?: string;
  dateofbirth?: Date;
  gender?: 'male' | 'female';
  email?: string;
  mobile?: string;
  streetaddress1?: string;
  streetaddress2?: string;
  city?: string;
  state?: string;
  zip?: string;
  userId?: string;
  member: boolean;
  status: 'active' | 'inactive' | 'deceased' | 'visitor';
  applicationrole:
    | 'super'
    | 'owner'
    | 'admin'
    | 'lead'
    | 'contributor'
    | 'viewer'
    | 'none';
  teams?: string[];
  family?: string;
};
