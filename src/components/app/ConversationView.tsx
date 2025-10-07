import { Paperclip, SendHorizontal, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
import { useMemo, useState, FormEvent, useEffect, useRef } from 'react';
import { ConversationSkeleton } from './ConversationSkeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { EmojiPicker } from './EmojiPicker';
export function ConversationView() {
  const isMobile = useIsMobile();
  const { 
    selectedChatId, 
    chats, 
    messagesByChatId, 
    users, 
    user, 
    sendMessage, 
    fetchMessages, 
    isMessagesLoading,
    selectChat,
  } = useAppStore(
    useShallow((state) => ({
      selectedChatId: state.selectedChatId,
      chats: state.chats,
      messagesByChatId: state.messagesByChatId,
      users: state.users,
      user: state.user,
      sendMessage: state.sendMessage,
      fetchMessages: state.fetchMessages,
      isMessagesLoading: state.isMessagesLoading,
      selectChat: state.selectChat,
    }))
  );
  const [messageText, setMessageText] = useState('');
  const scrollAreaRef = useRef<React.ElementRef<typeof ScrollArea>>(null);
  const usersById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);
  const chat = chats.find((c) => c.id === selectedChatId);
  const messages = useMemo(() => messagesByChatId[selectedChatId || ''] || [], [messagesByChatId, selectedChatId]);
  useEffect(() => {
    if (selectedChatId) {
      let timeoutId: NodeJS.Timeout;
      const pollMessages = async () => {
        try {
          await fetchMessages(selectedChatId);
        } finally {
          timeoutId = setTimeout(pollMessages, 3000);
        }
      };
      pollMessages();
      return () => clearTimeout(timeoutId);
    }
  }, [selectedChatId, fetchMessages]);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'auto',
      });
    }
  }, [messages]);
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChatId) return;
    sendMessage({ chatId: selectedChatId, text: messageText.trim() });
    setMessageText('');
  };
  const handleMobileBack = () => {
    selectChat(null); // This will trigger the effect in ChatsPage to change the URL
  };
  if (isMessagesLoading && messages.length === 0) {
    return <ConversationSkeleton />;
  }
  if (!chat || !user) {
    return (
      <div className="hidden md:flex h-full flex-col items-center justify-center bg-muted/50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Welcome to ConnectSphere</h2>
          <p className="text-muted-foreground">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }
  const otherParticipant = chat.participants.find(p => p.id !== user.id);
  const displayName = chat.type === 'group' ? chat.name : otherParticipant?.name;
  const displayAvatar = chat.type === 'group' ? chat.avatarUrl : otherParticipant?.avatarUrl;
  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background px-4 py-3">
        {isMobile && (
          <Button variant="ghost" size="icon" className="-ml-2" onClick={handleMobileBack}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarImage src={displayAvatar} alt={displayName} />
          <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{displayName}</p>
          <p className="text-sm text-muted-foreground">
            {chat.type === 'direct' && otherParticipant?.online ? 'Online' : 'Offline'}
          </p>
        </div>
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
          {messages.map((message) => {
            const sender = usersById.get(message.userId);
            const isMe = message.userId === user.id;
            if (!sender) return null;
            return (
              <div
                key={message.id}
                className={cn('flex items-end gap-2', isMe ? 'justify-end' : 'justify-start')}
              >
                {!isMe && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sender.avatarUrl} alt={sender.name} />
                    <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg px-3 py-2 md:max-w-md group relative',
                    isMe
                      ? 'bg-brand text-brand-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 float-right mt-1 ml-2">{format(new Date(message.ts), 'p')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <footer className="sticky bottom-0 border-t bg-background p-4">
        <form className="relative" onSubmit={handleSendMessage}>
          <Input
            placeholder="Type a message..."
            className="pr-28"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <EmojiPicker onEmojiSelect={(emoji) => setMessageText(prev => prev + emoji)} />
            <Button type="button" variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button type="submit" variant="ghost" size="icon" className="text-brand hover:text-brand">
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </footer>
    </div>
  );
}