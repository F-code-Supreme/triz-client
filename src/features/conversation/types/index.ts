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

export interface Message {
  id: string;
  content?: string;
  role: 'user' | 'assistant';
  conversationId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ConversationsResponse = PaginatedResponse<Conversation>;
export type MessagesResponse = PaginatedResponse<Message>;
