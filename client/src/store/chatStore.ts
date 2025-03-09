// store/chatStore.ts
import { create } from 'zustand';

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ChatState {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  resetSelectedUser: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  resetSelectedUser: () => set({ selectedUser: null }),
}));