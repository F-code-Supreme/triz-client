import type { PaginatedResponse } from '@/types';

export interface Conversation {
  id: string;
  title?: string;
  lastMessageAt?: string;
  updatedAt?: string;
  createdAt?: string;
  userId?: string;
  archived?: boolean;
}

export type ConversationsResponse = PaginatedResponse<Conversation>;
