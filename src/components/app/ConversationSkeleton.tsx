import { Skeleton } from '@/components/ui/skeleton';
export function ConversationSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background px-4 py-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </header>
      <div className="flex-1 p-4 space-y-4">
        <div className="flex items-end gap-2 justify-start">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>
        <div className="flex items-end gap-2 justify-end">
          <Skeleton className="h-16 w-64 rounded-lg" />
        </div>
        <div className="flex items-end gap-2 justify-start">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="flex items-end gap-2 justify-end">
          <Skeleton className="h-10 w-56 rounded-lg" />
        </div>
      </div>
      <footer className="sticky bottom-0 border-t bg-background p-4">
        <Skeleton className="h-10 w-full rounded-md" />
      </footer>
    </div>
  );
}