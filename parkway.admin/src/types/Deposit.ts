import { BaseEntity } from './BaseEntity.ts';

export enum DepositStatus {
  Undeposited = 'Undeposited',
  Unallocated = 'Unallocated',
  Processed = 'Processed'
}

export type Deposit = BaseEntity & {
  amount: number;
  currentStatus: DepositStatus;
  responsiblePartyProfileId: string;
  created: Date;
  statusDate: Date;
  history?: DepositHistory[];
  contributions: string[];
  donations: string[];
};

export type DepositHistory = {
  status: DepositStatus;
  date: Date;
  responsiblePartyProfileId: string;
};
