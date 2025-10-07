export interface Message {
  id: string;
  content: string | null;
  role: 'USER' | 'ASSISTANT' | null;
  createdAt: string | null;
  parentId: string | null;
  childrenIds: string[];
}
