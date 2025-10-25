import type { Book } from '../../types';

export interface IUploadBookPayload {
  file: File;
}

export interface IUpdateBookPayload extends Omit<Book, 'id'> {
  bookId: string;
}

export interface ITrackProgressPayload {
  bookId: string;
  userId: string;
  location: string;
}

export interface ITrackProgressDataResponse {
  location: string;
}
