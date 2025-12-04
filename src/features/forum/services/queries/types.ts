import type { Comment, ForumPost } from '@/features/forum/types';
import type { PaginatedResponse } from '@/types';

export type ForumPostResponse = PaginatedResponse<ForumPost>;
export type CommentResponse = PaginatedResponse<Comment>;
