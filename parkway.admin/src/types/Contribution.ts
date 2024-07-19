import { BaseEntity } from './BaseEntity.ts';

export type ContributionType =
  | 'cash'
  | 'check'
  | 'credit'
  | 'debit'
  | 'ach'
  | 'wire'
  | 'crypto';

export type Contribution = BaseEntity & {
  contributorProfileId: string;
  gross: number;
  fees: number;
  net: number;
  accounts: ContributionAccount[];
  transactionDate: Date;
  depositId?: string;
  type: ContributionType;
  notes: string[];
};

export interface ContributionAccount {
  account: string;
  amount: number;
}
