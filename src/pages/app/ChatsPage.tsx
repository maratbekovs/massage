import { ChatList } from '@/components/app/ChatList';
import { ConversationView } from '@/components/app/ConversationView';
import { NewChatModal } from '@/components/app/NewChatModal';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useAppStore } from '@/store/appStore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useShallow } from 'zustand/react/shallow';
export default function ChatsPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { selectChat, selectedChatId } = useAppStore(
    useShallow((state) => ({
      selectChat: state.selectChat,
      selectedChatId: state.selectedChatId,
    }))
  );
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    // This effect syncs the store with the URL param
    if (chatId) {
      selectChat(chatId);
    } else if (isMobile) {
      // On mobile, if URL has no chat ID, make sure no chat is selected in the store
      selectChat(null);
    }
  }, [chatId, selectChat, isMobile]);
  useEffect(() => {
    // This effect syncs the URL with the store's selected chat
    // It prevents being "stuck" on a chat view on mobile when the back button is used
    if (isMobile && !selectedChatId && chatId) {
      navigate('/app/chats', { replace: true });
    }
  }, [selectedChatId, isMobile, navigate, chatId]);
  if (isMobile) {
    return (
      <>
        {selectedChatId ? <ConversationView /> : <ChatList onNewChat={() => setIsNewChatModalOpen(true)} />}
        <NewChatModal isOpen={isNewChatModalOpen} onOpenChange={setIsNewChatModalOpen} />
      </>
    );
  }
  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
        <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
          <ChatList onNewChat={() => setIsNewChatModalOpen(true)} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={60}>
          <ConversationView />
        </ResizablePanel>
      </ResizablePanelGroup>
      <NewChatModal isOpen={isNewChatModalOpen} onOpenChange={setIsNewChatModalOpen} />
    </>
  );
}