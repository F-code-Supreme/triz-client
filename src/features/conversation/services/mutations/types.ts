export interface IArchiveConversationPayload {
  conversationId: string;
  archived: boolean;
}

export interface IRenameConversationPayload {
  conversationId: string;
  title: string;
}
