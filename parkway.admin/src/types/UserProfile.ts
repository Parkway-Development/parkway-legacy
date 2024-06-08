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
  address?: Address;
  member: boolean;
  teams?: string[];
  family?: string;
  preferences?: string;
};

export type Address = {
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type LimitedUserProfile = Pick<
  UserProfile,
  '_id' | 'firstName' | 'middleInitial' | 'lastName' | 'nickname'
>;

export const genderMapping: Record<
  NonNullable<UserProfile['gender']>,
  string
> = {
  male: 'Male',
  female: 'Female'
};
