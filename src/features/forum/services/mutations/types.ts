export interface CreateVotePayload {
  isUpvote: boolean;
}
export interface CreateCommentPayload {
  content: string;
}

export interface CreateForumPostPayload {
  title?: string;
  content?: string;
  imgUrl?: string;
  tagIds?: string[];
}

export type UUID = string;
export type ISODateString = string;

export interface CreateCommentResponse {
  id: UUID;
  content: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | string;
  createdBy: UUID;
  parentId: UUID | null;
  forumPostId: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
