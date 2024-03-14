import { BaseEntity } from './BaseEntity.ts';

export type Song = BaseEntity & {
  title: string;
  subtitle?: string;
  tempo?: number;
  timeSignature?: string;
  artists?: string[];
  ccliLicense?: string;
  copyrights?: string[];
  arrangements: SongArrangement[];
};

export type SongArrangement = {
  vocalist?: string;
  key: string;
  arrangementName: string;
  arrangementDescription?: string;
  documents?: SongArrangementDocuments[];
};

export type SongArrangementDocuments = {
  fileName: string;
  filePath: string;
  fileType: string;
};
