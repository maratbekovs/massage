import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { MOCK_LOGGED_IN_USER } from "@shared/mock-data";
import type { User, Chat } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // AUTH
  app.post('/api/auth/register', async (c) => {
    const { name, email, password } = (await c.req.json()) as { name?: string, email?: string, password?: string };
    if (!isStr(name) || !isStr(email) || !isStr(password)) {
      return bad(c, 'Name, email, and password are required');
    }
    // In a real app, you'd hash the password and check for existing email
    const newUser = await UserEntity.create(c.env, {
      id: crypto.randomUUID(),
      name,
      avatarUrl: `https://i.pravatar.cc/150?u=${email}`, // mock avatar
    });
    return ok(c, newUser);
  });
  app.post('/api/auth/login', async (c) => {
    const { email, password } = (await c.req.json()) as { email?: string, password?: string };
    if (!isStr(email) || !isStr(password)) {
      return bad(c, 'Email and password are required');
    }
    // This is a mock login. A real app would verify credentials against stored user data.
    // For now, we'll just return the mock logged-in user.
    return ok(c, MOCK_LOGGED_IN_USER);
  });
  app.get('/api/auth/check', (c) => {
    // Mock endpoint to check auth status. In a real app, this would check a session token.
    return ok(c, { user: MOCK_LOGGED_IN_USER });
  });
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const q = c.req.query('q');
    const lq = c.req.query('limit');
    // For simplicity, search ignores pagination for now. A real app would need a more robust search index.
    const page = await UserEntity.list(c.env, null, lq ? Math.max(1, (Number(lq) | 0)) : 100); // Limit to 100 for safety
    if (q) {
      page.items = page.items.filter(user => user.name.toLowerCase().includes(q.toLowerCase()));
      page.next = null; // Pagination is disabled for search results
    }
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    const user = await UserEntity.create(c.env, {
      id: crypto.randomUUID(),
      name: name.trim(),
      avatarUrl: `https://i.pravatar.cc/150?u=${crypto.randomUUID()}` // Mock avatar
    });
    return ok(c, user);
  });
  app.patch('/api/users/me', async (c) => {
    // In a real app, you'd get the user ID from the session/token.
    const userId = MOCK_LOGGED_IN_USER.id;
    const { name, avatarUrl } = await c.req.json<{ name?: string; avatarUrl?: string }>();
    const patchData: Partial<User> = {};
    if (isStr(name)) patchData.name = name;
    if (isStr(avatarUrl)) patchData.avatarUrl = avatarUrl;
    if (Object.keys(patchData).length === 0) {
      return bad(c, 'No updateable fields provided');
    }
    const userEntity = new UserEntity(c.env, userId);
    if (!(await userEntity.exists())) {
      return notFound(c, 'User not found');
    }
    await userEntity.patch(patchData);
    const updatedUser = await userEntity.getState();
    return ok(c, updatedUser);
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { participantIds, title } = await c.req.json<{ participantIds?: string[]; title?: string }>();
    if (!participantIds || participantIds.length === 0) {
      return bad(c, 'participantIds are required');
    }
    const currentUserId = MOCK_LOGGED_IN_USER.id;
    const allParticipantIds = [...new Set([currentUserId, ...participantIds])];
    if (allParticipantIds.length < 2) {
      return bad(c, 'At least two unique participants are required');
    }
    // Fetch all participant user objects
    const participantUsers = (await Promise.all(
      allParticipantIds.map(id => new UserEntity(c.env, id).getState())
    )).filter(Boolean) as User[];
    if (participantUsers.length !== allParticipantIds.length) {
      return bad(c, 'One or more participants not found');
    }
    const isGroupChat = allParticipantIds.length > 2;
    if (isGroupChat && !isStr(title)) {
      return bad(c, 'Group chats require a title');
    }
    // For direct chats, create a deterministic ID to prevent duplicates efficiently.
    const chatId = isGroupChat ? crypto.randomUUID() : allParticipantIds.sort().join('-');

    // Prevent duplicate direct chats
    if (!isGroupChat) {
      const chatEntity = new ChatBoardEntity(c.env, chatId);
      if (await chatEntity.exists()) {
        const existingChat = await chatEntity.getState();
        if (existingChat) return ok(c, existingChat);
      }
    }

    const newChat: Omit<Chat, 'lastMessage' | 'lastMessageTimestamp' | 'unreadCount'> = {
      id: chatId,
      type: isGroupChat ? 'group' : 'direct',
      participants: participantUsers,
      ...(isGroupChat && { name: title, title: title, avatarUrl: `https://i.pravatar.cc/150?u=${crypto.randomUUID()}` }),
    };
    const initialState = {
      ...ChatBoardEntity.initialState,
      ...newChat,
      lastMessage: 'Chat created',
      lastMessageTimestamp: Date.now(),
    };
    const created = await ChatBoardEntity.create(c.env, initialState);
    return ok(c, created);
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // DELETE: Users
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/users/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, list), ids: list });
  });
  // DELETE: Chats
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/chats/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, list), ids: list });
  });
}