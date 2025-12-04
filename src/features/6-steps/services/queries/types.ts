import type { Principle, Problem } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';

export interface IGetPrinciplesLookupDataItem {
  priority: number;
  principle: Principle;
}

export type IGetPrinciplesLookupDataResponse = IGetPrinciplesLookupDataItem[];

export type IGetJournalsByUserDataResponse = PaginatedResponse<
  Problem & DataTimestamp
>;

export type IGetJournalByIdDataResponse = Problem & DataTimestamp;
