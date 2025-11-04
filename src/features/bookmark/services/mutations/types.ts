export interface ICreateBookmarkPayload {
  bookId: string;
  title: string;
  location: string;
}

export interface IUpdateBookmarkPayload {
  bookId: string;
  bookmarkId: string;
  title?: string;
}

export interface IDeleteBookmarkPayload {
  bookId: string;
  bookmarkId: string;
}
