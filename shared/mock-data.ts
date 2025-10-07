import type { User, Chat, ChatMessage } from './types';
export const MOCK_LOGGED_IN_USER: User = {
  id: 'u1',
  name: 'You',
  avatarUrl: 'https://i.pravatar.cc/150?u=u1',
  online: true,
};
export const MOCK_USERS: User[] = [
  MOCK_LOGGED_IN_USER,
  { id: 'u2', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=u2', online: true },
  { id: 'u3', name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?u=u3', online: false },
  { id: 'u4', name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=u4', online: true },
  { id: 'u5', name: 'Diana', avatarUrl: 'https://i.pravatar.cc/150?u=u5', online: false },
  { id: 'u6', name: 'College Faculty', avatarUrl: 'https://i.pravatar.cc/150?u=u6', online: true },
];
const findUser = (id: string) => MOCK_USERS.find(u => u.id === id)!;
export const MOCK_CHATS: Chat[] = [
  {
    id: 'c1',
    type: 'direct',
    participants: [findUser('u1'), findUser('u2')],
    lastMessage: 'Hey, how are you?',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 5,
    unreadCount: 2,
  },
  {
    id: 'c2',
    type: 'direct',
    participants: [findUser('u1'), findUser('u3')],
    lastMessage: 'See you tomorrow!',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 2,
    unreadCount: 0,
  },
  {
    id: 'c3',
    type: 'group',
    name: 'Project Group',
    avatarUrl: 'https://i.pravatar.cc/150?u=g1',
    participants: [findUser('u1'), findUser('u4'), findUser('u5')],
    lastMessage: 'Diana: I pushed the latest changes.',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 24,
    unreadCount: 5,
  },
  {
    id: 'c4',
    type: 'direct',
    participants: [findUser('u1'), findUser('u6')],
    lastMessage: 'You: Thanks for the clarification!',
    lastMessageTimestamp: Date.now() - 1000 * 60 * 60 * 48,
    unreadCount: 0,
  },
];
export const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u2', text: 'Hey, how are you?', ts: Date.now() - 1000 * 60 * 6 },
  { id: 'm2', chatId: 'c1', userId: 'u2', text: 'Did you see the assignment?', ts: Date.now() - 1000 * 60 * 5 },
  { id: 'm3', chatId: 'c2', userId: 'u1', text: 'Hey Bob, are we on for tomorrow?', ts: Date.now() - 1000 * 60 * 60 * 3 },
  { id: 'm4', chatId: 'c2', userId: 'u3', text: 'Yep, see you then!', ts: Date.now() - 1000 * 60 * 60 * 2 },
  { id: 'm5', chatId: 'c3', userId: 'u4', text: 'Hey team, meeting at 4?', ts: Date.now() - 1000 * 60 * 60 * 26 },
  { id: 'm6', chatId: 'c3', userId: 'u1', text: 'Sounds good to me.', ts: Date.now() - 1000 * 60 * 60 * 25 },
  { id: 'm7', chatId: 'c3', userId: 'u5', text: 'I pushed the latest changes.', ts: Date.now() - 1000 * 60 * 60 * 24 },
];