import type { PaginatedResponse } from '@/types';

export interface Feature {
  iconUrl: string;
  description: string;
}

export enum PackageStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Package {
  id: string;
  name: string;
  priceInTokens: number;
  durationInDays: number;
  chatTokenPerDay: number;
  status: PackageStatus;
  features: Feature[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
export type PackageResponse = PaginatedResponse<Package>;
