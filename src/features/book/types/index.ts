export interface Book {
  id: string;
  title?: string;
  author?: string;
  publisher?: string;
  bCoverUrl?: string;
  bUrl: string;
  status: BookStatus;

  deletedAt: string | null;
}

export interface AdminBook extends Book {
  displayOrder: number;
}

export enum BookStatus {
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
}

export interface BookProgress {
  location: string;
  percentage: number;
}
