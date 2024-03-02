import { BaseEntity } from './BaseEntity.ts';
import { SelectProps } from 'antd';

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

export type StatusOptionType = {
  value: UserProfile['status'];
  label: string;
};

export const statusOptions: SelectProps<string, StatusOptionType>['options'] = [
  {
    value: 'active',
    label: 'Active'
  },
  {
    value: 'inactive',
    label: 'Inactive'
  },
  {
    value: 'deceased',
    label: 'Deceased'
  },
  {
    value: 'visitor',
    label: 'Visitor'
  }
];

export type ApplicationRoleOptionType = {
  value: UserProfile['applicationrole'];
  label: string;
};

export const applicationRoleOptions: SelectProps<
  string,
  ApplicationRoleOptionType
>['options'] = [
  {
    value: 'none',
    label: 'None'
  },
  {
    value: 'super',
    label: 'Super'
  },
  {
    value: 'owner',
    label: 'Owner'
  },
  {
    value: 'admin',
    label: 'Admin'
  },
  {
    value: 'lead',
    label: 'Lead'
  },
  {
    value: 'contributor',
    label: 'Contributor'
  },
  {
    value: 'viewer',
    label: 'Viewer'
  }
];
