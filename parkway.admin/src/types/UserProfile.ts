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

export const genderMapping: Record<
  NonNullable<UserProfile['gender']>,
  string
> = {
  male: 'Male',
  female: 'Female'
};

export const statusMapping: Record<UserProfile['status'], string> = {
  active: 'Active',
  inactive: 'Inactive',
  deceased: 'Deceased',
  visitor: 'Visitor'
};

export const applicationRoleMapping: Record<
  UserProfile['applicationrole'],
  string
> = {
  none: 'None',
  super: 'Super',
  owner: 'Owner',
  admin: 'Admin',
  lead: 'Lead',
  contributor: 'Contributor',
  viewer: 'Viewer'
};
