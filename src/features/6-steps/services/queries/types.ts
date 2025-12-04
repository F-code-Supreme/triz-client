import type { Principle } from '../../types';

export interface IGetPrinciplesLookupDataItem {
  priority: number;
  principle: Principle;
}

export type IGetPrinciplesLookupDataResponse = IGetPrinciplesLookupDataItem[];
