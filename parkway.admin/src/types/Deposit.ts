import { BaseEntity } from './BaseEntity.ts';

export enum DepositStatus {
  Undeposited = 'undeposited',
  Unallocated = 'unallocated',
  Processed = 'processed'
}

export type Deposit = BaseEntity & {
  amount: number;
  currentStatus: DepositStatus;
  responsiblePartyProfileId: string;
  approverProfileId: string;
  createdAt: Date;
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
