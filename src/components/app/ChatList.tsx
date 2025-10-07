import { Search, PlusCircle, MessageSquarePlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { formatDistanceToNow } from 'date-fns';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export function ChatList({ onNewChat }: { onNewChat: () => void }) {
  const navigate = useNavigate();
  const { chats, selectedChatId, selectChat, user } = useAppStore(
    useShallow((state) => ({
      chats: state.chats,
      selectedChatId: state.selectedChatId,
      selectChat: state.selectChat,
      user: state.user,
    }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    navigate(`/app/chats/${chatId}`);
  };
  const filteredChats = chats.filter(chat => {
    const otherParticipant = chat.participants.find(p => p.id !== user?.id);
    const displayName = chat.type === 'group' ? chat.name : otherParticipant?.name;
    return displayName?.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <div className="flex h-full flex-col border-r">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4">
        <h1 className="text-xl font-bold">Chats</h1>
        <Button variant="ghost" size="icon" onClick={onNewChat}>
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4 pt-0">
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {filteredChats.length > 0 ? (
          <div className="flex flex-col gap-1 p-2 pt-0">
            {filteredChats.map((chat) => {
              const otherParticipant = chat.participants.find(p => p.id !== user?.id);
              const displayName = chat.type === 'group' ? chat.name : otherParticipant?.name;
              const displayAvatar = chat.type === 'group' ? chat.avatarUrl : otherParticipant?.avatarUrl;
              return (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all hover:bg-accent',
                    selectedChatId === chat.id && 'bg-accent'
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={displayAvatar} alt={displayName} />
                      <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {otherParticipant?.online && chat.type === 'direct' && (
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-baseline justify-between">
                      <p className="truncate font-semibold">{displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(chat.lastMessageTimestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm text-muted-foreground">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs text-brand-foreground">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <MessageSquarePlus className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Chats Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click the plus icon to start a new conversation.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}