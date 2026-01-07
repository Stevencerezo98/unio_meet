
'use client';

import React from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  LayoutGrid,
  PhoneOff,
  Users,
  ScreenShareOff,
  Smile,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MeetingToolbarProps {
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
  isTileView: boolean;
  isSidebarOpen: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleShareScreen: () => void;
  toggleTileView: () => void;
  toggleSidebar: () => void;
  hangup: () => void;
  sendReaction: (reaction: string) => void;
}

const hapticFeedback = () => {
    if(navigator.vibrate) {
        navigator.vibrate(50);
    }
}

const ToolbarButton = ({
  onClick,
  label,
  children,
  isActive = false,
  variant,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  isActive?: boolean;
  variant?: 'destructive';
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={variant}
        size="icon"
        onClick={() => { onClick(); hapticFeedback(); }}
        className={`rounded-full h-14 w-14 transition-colors duration-300 ${
          isActive
            ? 'bg-primary/80 hover:bg-primary text-primary-foreground'
            : variant === 'destructive'
            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            : 'bg-black/40 hover:bg-black/60 text-white'
        }`}
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{label}</p>
    </TooltipContent>
  </Tooltip>
);

const ReactionsPopover = ({ onReactionClick }: { onReactionClick: (reaction: string) => void }) => {
    const reactions = [
        { emoji: '👍', name: 'like' },
        { emoji: '❤️', name: 'love' },
        { emoji: '👏', name: 'clap' },
        { emoji: '😂', name: 'laugh' },
        { emoji: '🎉', name: 'celebrate' },
    ];

    return (
        <Popover>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <Button
                            size="icon"
                            className="rounded-full h-14 w-14 bg-black/40 hover:bg-black/60 text-white"
                             onClick={hapticFeedback}
                        >
                            <Smile className="h-6 w-6" />
                        </Button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Reacciones</p>
                </TooltipContent>
            </Tooltip>
            <PopoverContent className="w-auto bg-background/80 backdrop-blur-md border-border p-2">
                <div className="flex gap-2">
                    {reactions.map((r) => (
                        <Button
                            key={r.name}
                            variant="ghost"
                            size="icon"
                            className="text-2xl"
                            onClick={() => {onReactionClick(r.name); hapticFeedback();}}
                        >
                            {r.emoji}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default function MeetingToolbar({
  isAudioMuted,
  isVideoMuted,
  isScreenSharing,
  isTileView,
  isSidebarOpen,
  toggleAudio,
  toggleVideo,
  toggleShareScreen,
  toggleTileView,
  toggleSidebar,
  hangup,
  sendReaction,
}: MeetingToolbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pb-[env(safe-area-inset-bottom)]">
      <TooltipProvider>
        <div className="flex items-center justify-center gap-4 rounded-full bg-black/30 backdrop-blur-md p-3 border border-neutral-700/50 shadow-2xl">
          <ToolbarButton onClick={toggleAudio} label={isAudioMuted ? 'Unmute' : 'Mute'}>
            {isAudioMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </ToolbarButton>

          <ToolbarButton onClick={toggleVideo} label={isVideoMuted ? 'Start Video' : 'Stop Video'}>
            {isVideoMuted ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
          </ToolbarButton>

          <ToolbarButton
            onClick={toggleShareScreen}
            label={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            isActive={isScreenSharing}
          >
            {isScreenSharing ? (
              <ScreenShareOff className="h-6 w-6" />
            ) : (
              <ScreenShare className="h-6 w-6" />
            )}
          </ToolbarButton>

          <ReactionsPopover onReactionClick={sendReaction} />

          <ToolbarButton
            onClick={toggleTileView}
            label={isTileView ? 'Switch to Speaker View' : 'Switch to Tile View'}
            isActive={isTileView}
          >
            <LayoutGrid className="h-6 w-6" />
          </ToolbarButton>

          <ToolbarButton
            onClick={toggleSidebar}
            label={isSidebarOpen ? 'Hide Participants' : 'Show Participants'}
            isActive={isSidebarOpen}
          >
            <Users className="h-6 w-6" />
          </ToolbarButton>

          <ToolbarButton onClick={hangup} label="Leave Meeting" variant="destructive">
            <PhoneOff className="h-6 w-6" />
          </ToolbarButton>
        </div>
      </TooltipProvider>
    </div>
  );
}
