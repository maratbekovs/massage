import { MessageSquareText } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
export function ConnectSphereLogo({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-foreground", className)}>
      {children ? (
        children
      ) : (
        <>
          <MessageSquareText className="h-8 w-8 text-brand" />
          <span className="text-2xl font-bold font-display">ConnectSphere</span>
        </>
      )}
    </div>
  );
}