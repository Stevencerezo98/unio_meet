'use client';

import React from 'react';
import { X, User } from 'lucide-react';
import type { JitsiParticipant } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from './ui/scroll-area';

interface ParticipantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  participants: JitsiParticipant[];
}

export default function ParticipantSidebar({
  isOpen,
  onClose,
  participants,
}: ParticipantSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed top-0 right-0 h-full w-80 z-50 bg-black/30 backdrop-blur-xl border-l border-neutral-700/50 transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b border-neutral-700/50">
          <h2 className="text-xl font-semibold">Participants ({participants.length})</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </header>
        <ScrollArea className="flex-1">
          <ul className="p-4 space-y-3">
            {participants.map((p, index) => (
              <li key={p.id || index} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={p.avatarURL} alt={p.displayName} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium">{p.displayName}</p>
                  <p className="text-xs text-muted-foreground">{p.role === 'moderator' ? 'Host' : 'Participant'}</p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </aside>
  );
}
