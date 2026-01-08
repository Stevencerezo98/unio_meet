
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
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

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
  className,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  isActive?: boolean;
  variant?: 'destructive';
  className?: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={variant}
        size="icon"
        onClick={() => { onClick(); hapticFeedback(); }}
        className={`rounded-full h-12 w-12 md:h-14 md:w-14 transition-colors duration-300 ${
          isActive
            ? 'bg-primary/80 hover:bg-primary text-primary-foreground'
            : variant === 'destructive'
            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            : 'bg-black/40 hover:bg-black/60 text-white'
        } ${className}`}
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
                            className="rounded-full h-12 w-12 md:h-14 md:w-14 bg-black/40 hover:bg-black/60 text-white"
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
  const { toast } = useToast();

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    const lobbyUrl = currentUrl.replace('/meeting/', '/lobby/');
    navigator.clipboard.writeText(lobbyUrl).then(() => {
      toast({
        title: '¡Enlace de invitación copiado!',
        description: 'Ya puedes compartirlo con otros participantes.',
      });
    });
  };

  return (
    <motion.div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full pb-[env(safe-area-inset-bottom)]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <div className="group absolute bottom-0 left-0 right-0 h-40">
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <TooltipProvider>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                    {/* Main Controls - Mic, Video, Hangup */}
                    <div className="flex items-center justify-center gap-3 rounded-full bg-black/30 backdrop-blur-md p-2 border border-neutral-700/50 shadow-2xl">
                        <ToolbarButton onClick={toggleAudio} label={isAudioMuted ? 'Unmute' : 'Mute'}>
                        {isAudioMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                        </ToolbarButton>

                        <ToolbarButton onClick={toggleVideo} label={isVideoMuted ? 'Start Video' : 'Stop Video'}>
                        {isVideoMuted ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                        </ToolbarButton>
                        
                        <ToolbarButton onClick={hangup} label="Leave Meeting" variant="destructive">
                        <PhoneOff className="h-6 w-6" />
                        </ToolbarButton>
                    </div>

                    {/* Secondary Controls - Share, Reactions, etc. */}
                    <div className="flex items-center justify-center gap-3 rounded-full bg-black/30 backdrop-blur-md p-2 border border-neutral-700/50 shadow-2xl">
                        <ToolbarButton
                        onClick={toggleShareScreen}
                        label={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                        isActive={isScreenSharing}
                        className="hidden sm:inline-flex"
                        >
                        {isScreenSharing ? (
                            <ScreenShareOff className="h-6 w-6" />
                        ) : (
                            <ScreenShare className="h-6 w-6" />
                        )}
                        </ToolbarButton>
                        
                        <ToolbarButton
                        onClick={handleCopyLink}
                        label="Copiar enlace de invitación"
                        >
                        <Share2 className="h-6 w-6" />
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
                    </div>
                    </div>
                </TooltipProvider>
            </div>
        </div>
    </motion.div>
  );
}
