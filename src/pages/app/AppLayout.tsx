import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/app/Sidebar';
import { Toaster } from '@/components/ui/sonner';
export default function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Toaster richColors />
    </div>
  );
}