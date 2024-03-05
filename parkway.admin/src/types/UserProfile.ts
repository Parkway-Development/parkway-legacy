import { BaseEntity } from './BaseEntity.ts';

export type UserProfile = BaseEntity & {
  user?: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  nickname?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female';
  email?: string;
  mobilePhone?: string;
  homePhone?: string;
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  zip?: string;
  member: boolean;
  memberStatus:
    | 'active'
    | 'inactive'
    | 'deceased'
    | 'visitor'
    | 'child'
    | 'guest';
  applicationRole:
    | 'super'
    | 'owner'
    | 'admin'
    | 'lead'
    | 'contributor'
    | 'viewer'
    | 'none';
  teams?: string[];
  family?: string;
  permissions?: string;
  preferences?: string;
};

export const genderMapping: Record<
  NonNullable<UserProfile['gender']>,
  string
> = {
  male: 'Male',
  female: 'Female'
};

export const memberStatusMapping: Record<UserProfile['memberStatus'], string> =
  {
    active: 'Active',
    inactive: 'Inactive',
    deceased: 'Deceased',
    visitor: 'Visitor',
    child: 'Child',
    guest: 'Guest'
  };

export const applicationRoleMapping: Record<
  UserProfile['applicationRole'],
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
