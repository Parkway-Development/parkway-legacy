import { BaseEntity } from './BaseEntity.ts';

export type Vendor = BaseEntity & {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  website?: string;
  contact?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
};
