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

export interface SongArrangement {
  vocalist?: string;
  key: string;
  arrangementName: string;
  arrangementDescription?: string;
  documents?: SongArrangementDocuments[];
}

export interface SongArrangementDocuments {
  fileName: string;
  filePath: string;
  fileType: string;
}
