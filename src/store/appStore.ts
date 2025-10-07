import { create } from 'zustand';
import type { User, Chat, ChatMessage } from '@shared/types';
import { api } from '@/lib/api-client';
interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  users: User[];
  chats: Chat[];
  messagesByChatId: Record<string, ChatMessage[]>;
  selectedChatId: string | null;
  isLoading: boolean;
  isMessagesLoading: boolean;
  error: string | null;
  searchResults: User[];
  isSearching: boolean;
  isCreatingChat: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (details: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  selectChat: (chatId: string | null) => void;
  fetchUsers: () => Promise<void>;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (payload: { chatId: string; text: string }) => Promise<void>;
  updateProfile: (details: Partial<Pick<User, 'name' | 'avatarUrl'>>) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  createChat: (participantIds: string[], title?: string) => Promise<Chat | null>;
}
export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  users: [],
  chats: [],
  messagesByChatId: {},
  selectedChatId: null,
  isLoading: true,
  isMessagesLoading: false,
  error: null,
  searchResults: [],
  isSearching: false,
  isCreatingChat: false,
  fetchUsers: async () => {
    try {
      const { items } = await api<{ items: User[] }>('/api/users');
      set({ users: items });
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  },
  fetchChats: async () => {
    try {
      const { items } = await api<{ items: Chat[] }>('/api/chats');
      set({ chats: items });
      if (!get().selectedChatId && items.length > 0) {
        get().selectChat(items[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch chats", error);
    }
  },
  fetchMessages: async (chatId: string) => {
    set({ isMessagesLoading: true });
    try {
      const messages = await api<ChatMessage[]>(`/api/chats/${chatId}/messages`);
      set((state) => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: messages,
        },
      }));
    } catch (error) {
      console.error(`Failed to fetch messages for chat ${chatId}`, error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async ({ chatId, text }) => {
    const user = get().user;
    if (!user) return;
    try {
      const newMessage = await api<ChatMessage>(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, text }),
      });
      set((state) => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: [...(state.messagesByChatId[chatId] || []), newMessage],
        },
      }));
    } catch (error) {
      console.error("Failed to send message", error);
    }
  },
  updateProfile: async (details) => {
    try {
      const updatedUser = await api<User>('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify(details),
      });
      set((state) => ({
        user: updatedUser,
        users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      }));
    } catch (error) {
      console.error("Failed to update profile", error);
      throw error; // Re-throw to be caught in the component
    }
  },
  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await api<{ user: User }>('/api/auth/check');
      set({ isAuthenticated: true, user, isLoading: false });
      await get().fetchUsers();
      await get().fetchChats();
    } catch (error) {
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      await api<User>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      await get().checkAuth();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
  register: async (details) => {
    set({ isLoading: true, error: null });
    try {
      await api<User>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(details),
      });
      await get().checkAuth();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      users: [],
      chats: [],
      messagesByChatId: {},
      selectedChatId: null,
    });
  },
  selectChat: (chatId) => {
    set({ selectedChatId: chatId });
    if (chatId) {
      get().fetchMessages(chatId);
    }
  },
  searchUsers: async (query: string) => {
    if (!query) {
      set({ searchResults: [] });
      return;
    }
    set({ isSearching: true });
    try {
      const { items } = await api<{ items: User[] }>(`/api/users?q=${encodeURIComponent(query)}`);
      const currentUser = get().user;
      set({ searchResults: items.filter(u => u.id !== currentUser?.id) });
    } catch (error) {
      console.error("Failed to search users", error);
      set({ searchResults: [] });
    } finally {
      set({ isSearching: false });
    }
  },
  createChat: async (participantIds, title) => {
    set({ isCreatingChat: true });
    try {
      const newChat = await api<Chat>('/api/chats', {
        method: 'POST',
        body: JSON.stringify({ participantIds, title }),
      });
      await get().fetchChats();
      return newChat;
    } catch (error) {
      console.error("Failed to create chat", error);
      return null;
    } finally {
      set({ isCreatingChat: false });
    }
  },
}));