import type { Feature, PackageStatus } from '@/features/packages/types';

export interface CreatePackagePayload {
  name: string;
  priceInTokens: number;
  durationInDays: number;
  chatTokenPerDay: number;
  features: Feature[];
  status?: PackageStatus;
}

export interface UpdatePackagePayload extends Partial<CreatePackagePayload> {
  id: string;
}
