import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { useDebounce } from 'react-use';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { User } from '@shared/types';
import { useNavigate } from 'react-router-dom';
export function NewChatModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const { searchResults, isSearching, searchUsers, createChat, isCreatingChat, selectChat } = useAppStore(
    useShallow((state) => ({
      searchResults: state.searchResults,
      isSearching: state.isSearching,
      searchUsers: state.searchUsers,
      createChat: state.createChat,
      isCreatingChat: state.isCreatingChat,
      selectChat: state.selectChat,
    }))
  );
  const [query, setQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  useDebounce(() => {
    searchUsers(query);
  }, 300, [query]);
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedUsers([]);
      setGroupName('');
      searchUsers(''); // Clear results
    }
  }, [isOpen, searchUsers]);
  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setQuery('');
  };
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };
  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;
    const participantIds = selectedUsers.map((u) => u.id);
    const isGroup = participantIds.length > 1;
    if (isGroup && !groupName.trim()) {
      // Maybe show a toast here
      return;
    }
    const newChat = await createChat(participantIds, isGroup ? groupName : undefined);
    if (newChat) {
      onOpenChange(false);
      selectChat(newChat.id);
      navigate(`/app/chats/${newChat.id}`);
    }
  };
  const isGroupChat = selectedUsers.length > 1;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>Search for users to start a conversation.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-md border p-2">
              {selectedUsers.map((user) => (
                <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                  {user.name}
                  <button onClick={() => handleRemoveUser(user.id)} className="rounded-full hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <Input
            id="search-users"
            placeholder="Search by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isGroupChat && (
            <Input
              id="group-name"
              placeholder="Group Name (required)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          )}
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {isSearching && <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin" /></div>}
              {!isSearching && searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-accent"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button
            onClick={handleCreateChat}
            disabled={selectedUsers.length === 0 || isCreatingChat || (isGroupChat && !groupName.trim())}
            className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {isCreatingChat && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGroupChat ? 'Create Group Chat' : 'Start Chat'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}