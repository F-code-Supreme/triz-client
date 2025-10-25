import type { Book } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';

export interface IGetBookProgressDataResponse {
  location: string;
}

export type BooksResponse = PaginatedResponse<Book & DataTimestamp>;
