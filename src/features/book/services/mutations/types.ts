import type { AdminBook } from '../../types';

export interface IUpdateBookPayload extends Omit<AdminBook, 'id'> {
  bookId: string;
}

export interface IDeleteBookPayload {
  bookId: string;
  force?: boolean;
}

export interface IRestoreBookPayload {
  bookId: string;
}

export interface ITrackProgressPayload {
  bookId: string;
  location: string;
  percentage: number;
}

export interface ITrackProgressDataResponse {
  location: string;
  percentage: number;
}
