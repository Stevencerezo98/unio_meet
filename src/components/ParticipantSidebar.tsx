
'use client';

import React from 'react';
import { X, User, MoreVertical, MicOff, Star } from 'lucide-react';
import type { JitsiParticipant } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ParticipantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  participants: JitsiParticipant[];
}

const ParticipantActions = ({ participant }: { participant: JitsiParticipant }) => {
  if (participant.local) {
    return null; // No actions for self
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <MicOff className="mr-2 h-4 w-4" />
          <span>Mute Participant</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Star className="mr-2 h-4 w-4" />
          <span>Make Moderator</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">
          <X className="mr-2 h-4 w-4" />
          <span>Kick Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function ParticipantSidebar({
  isOpen,
  onClose,
  participants,
}: ParticipantSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed top-0 right-0 h-full w-80 z-50 bg-background/80 backdrop-blur-xl border-l border-border transition-transform duration-300 ease-in-out text-foreground',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Participants ({participants.length})</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </header>
        <ScrollArea className="flex-1">
          <ul className="p-4 space-y-3">
            {participants.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={p.avatarURL} alt={p.displayName} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium">{p.displayName}{p.local ? ' (You)' : ''}</p>
                  <p className="text-xs text-muted-foreground">{p.role === 'moderator' ? 'Host' : 'Participant'}</p>
                </div>
                <ParticipantActions participant={p} />
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </aside>
  );
}
