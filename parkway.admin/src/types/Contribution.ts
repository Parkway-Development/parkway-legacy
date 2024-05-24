import { BaseEntity } from './BaseEntity.ts';

export type Contribution = BaseEntity & {
  profile: string;
  gross: number;
  fees: number;
  net: number;
  accounts: ContributionAccount[];
  transactionDate: Date;
  depositId?: string;
  type: string;
};

export interface ContributionAccount {
  account: string;
  amount: number;
}
