import { NavLink, useLocation } from 'react-router-dom';
import { MessageSquare, User as UserIcon, Settings, LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store/appStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ConnectSphereLogo } from '../ConnectSphereLogo';
const navItems = [
  { to: '/app/chats', icon: MessageSquare, label: 'Chats' },
  { to: '/app/profile', icon: UserIcon, label: 'Profile' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];
export function Sidebar() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const isMobile = useIsMobile();
  const location = useLocation();
  const baseLinkClass = "flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground";
  const activeLinkClass = "bg-accent text-accent-foreground";
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/80 backdrop-blur-sm">
        <div className="grid h-16 grid-cols-3 items-center justify-items-center px-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => cn(baseLinkClass, 'flex-col gap-1 h-full w-full', isActive && 'text-brand')}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    );
  }
  return (
    <aside className="hidden md:flex h-full w-16 flex-col border-r bg-background">
      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-col items-center gap-4 px-2 py-4 flex-1">
          <NavLink to="/app/chats" className="mb-4">
            <ConnectSphereLogo className="text-sm">
              <MessageSquare className="h-6 w-6 text-brand" />
            </ConnectSphereLogo>
          </NavLink>
          {navItems.map(({ to, icon: Icon, label }) => (
            <Tooltip key={to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={to}
                  className={cn(baseLinkClass, 'h-9 w-9', location.pathname.startsWith(to) && activeLinkClass)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{label}</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/login" className={cn(baseLinkClass, 'h-9 w-9')} onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </nav>
      </TooltipProvider>
    </aside>
  );
}