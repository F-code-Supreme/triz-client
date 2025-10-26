export interface ICreateBookmarkPayload {
  bookId: string;
  title: string;
  location: string;
}

export interface IUpdateBookmarkPayload {
  bookmarkId: string;
  title?: string;
}

export interface IDeleteBookmarkPayload {
  bookmarkId: string;
}
