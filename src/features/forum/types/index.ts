// helper types
export type UUID = string;
export type ISODateString = string;

export type ForumPostStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DELETED';

// chính interface
export interface ForumPost {
  id: UUID;
  title: string;
  content: string;
  status: ForumPostStatus;
  createdBy: UUID; // user id (UUID)
  upVoteCount: number;
  downVoteCount: number;
  replyCount: number;
  tagIds: UUID[]; // danh sách tag id
  createdAt: ISODateString; // ISO timestamp, ex: "2025-11-27T09:58:31.544926Z"
  updatedAt: ISODateString;
  userName: string;
  userId: string;
  avtUrl: string;
}

export interface Comment {
  id: UUID;
  content: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | string;
  createdBy: UUID;
  parentId: UUID | null;
  forumPostId: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  userName?: string;
  avtUrl?: string;
}
