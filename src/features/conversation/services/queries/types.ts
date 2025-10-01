import type { Conversation } from '../../types';
import type { Message } from '@/features/chat-triz/types';

export interface IGetConversationDataResponse extends Conversation {
  mappings: Record<string, Message>;
}
