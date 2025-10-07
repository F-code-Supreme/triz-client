import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STRING_EMPTY } from '@/constants';

interface ConversationsQueryState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  clearActiveConversation: () => void;
}

const initialState = {
  searchQuery: STRING_EMPTY,
  activeConversationId: null,
};

export const useConversationsQueryStore = create<ConversationsQueryState>()(
  persist(
    (set) => ({
      ...initialState,
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      setActiveConversationId: (id: string | null) =>
        set({ activeConversationId: id }),
      clearActiveConversation: () => set({ activeConversationId: null }),
    }),
    {
      name: 'conversations-query-storage',
    },
  ),
);
