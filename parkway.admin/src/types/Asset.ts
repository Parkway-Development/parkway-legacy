import { BaseEntity } from './BaseEntity.ts';

export type Asset = BaseEntity & {
  name: string;
  description?: string;
  value: number;
  purchaseDate?: Date;
  depreciationType: string;
  inServiceDate: Date;
  usefulLifeInDays: number;
  assetType: string;
  assetCategory: string;
  assetLocation: string;
  assetStatus: string;
  assetCondition: string;
  notes?: string[];
};
