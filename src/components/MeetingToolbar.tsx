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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

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
}

const ToolbarButton = ({
  onClick,
  label,
  children,
  isActive = false,
  variant = 'secondary',
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  isActive?: boolean;
  variant?: 'secondary' | 'destructive';
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={variant === 'destructive' ? 'destructive' : 'secondary'}
        size="icon"
        onClick={onClick}
        className={`rounded-full h-14 w-14 transition-colors duration-300 ${
          isActive ? 'bg-primary/80 hover:bg-primary' : 'bg-neutral-700/80 hover:bg-neutral-600/80'
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
}: MeetingToolbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
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
