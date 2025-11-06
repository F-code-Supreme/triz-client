import type { AdminBook, Book, BookProgress } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';

export type BooksResponse = PaginatedResponse<Book & DataTimestamp>;

export interface IGetAllBookProgressDataItem extends Book {
  progress: BookProgress;
}

export type IGetAllBookProgressDataResponse =
  PaginatedResponse<IGetAllBookProgressDataItem>;

export type IGetAllBooksAdminDataResponse = PaginatedResponse<AdminBook>;
