import type { Message } from '../../types';

export interface IChatPayload {
  id: string;
  content: string;
  parentId: string | null;
  conversationId: string;
}

export interface IChatDataResponse {
  conversationId: string;
  title: string;
  lastMessageAt: string;
  message: Message;
}
