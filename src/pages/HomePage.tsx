import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, checkAuth } = useAppStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      checkAuth: state.checkAuth,
    }))
  );
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/app/chats', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand border-t-transparent" />
    </div>
  );
}