import { BaseEntity } from './BaseEntity.ts';

export type Contribution = BaseEntity & {
  totalAmount: number;
  transactionDate: Date;
  depositDate?: Date;
  locked: boolean;
  depositBatchId?: string;
  type: string;
  accounts: ContributionAccount[];
  profile: string;
};

export type ContributionAccount = {
  account: string;
  amount: number;
};
