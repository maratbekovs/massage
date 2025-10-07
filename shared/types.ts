export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name:string;
  avatarUrl: string;
  online?: boolean;
}
export interface Chat {
  id: string;
  type: 'direct' | 'group';
  participants: User[];
  name?: string; // For group chats
  title?: string; // For group chats, aligning with backend
  avatarUrl?: string; // For group chats
  lastMessage: string;
  lastMessageTimestamp: number;
  unreadCount: number;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string; // Changed from sender: User
  text: string;
  ts: number; // Changed from timestamp: number
}