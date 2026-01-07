
'use client';

import React, { useRef, useState } from 'react';
import { useJitsi } from '@/hooks/useJitsi';
import MeetingToolbar from './MeetingToolbar';
import ParticipantSidebar from './ParticipantSidebar';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


interface MeetingRoomProps {
    roomName: string;
    displayName?: string;
    avatarUrl?: string;
    startWithAudioMuted?: boolean;
    startWithVideoMuted?: boolean;
}

export default function MeetingRoom({ 
    roomName,
    displayName,
    avatarUrl,
    startWithAudioMuted,
    startWithVideoMuted
}: MeetingRoomProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onMeetingEnd = () => {
    router.push('/thank-you');
  };

  const { isApiReady, isJoined, participants, controls } = useJitsi({
    roomName: roomName,
    parentNode: jitsiContainerRef,
    onMeetingEnd,
    displayName,
    avatarUrl,
    startWithAudioMuted,
    startWithVideoMuted
  });

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  
  const showAvatar = isJoined && controls.isVideoMuted;

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-0 md:p-4">
      <div className="relative w-full h-full md:rounded-[24px] overflow-hidden bg-black shadow-2xl border-border">
        {showAvatar && (
             <div className="absolute inset-0 flex items-center justify-center z-0">
                <Avatar className="h-40 w-40 border-4 border-background">
                    <AvatarImage src={avatarUrl ?? undefined} />
                    <AvatarFallback className="text-6xl">
                        {displayName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
        )}
       
        <div ref={jitsiContainerRef} className={`w-full h-full transition-opacity ${showAvatar ? 'opacity-0' : 'opacity-100'}`} />
        
        {!isApiReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-foreground">Joining meeting room...</p>
            </div>
        )}

        {isApiReady && isJoined && (
          <>
            <MeetingToolbar
              isAudioMuted={controls.isAudioMuted}
              isVideoMuted={controls.isVideoMuted}
              isScreenSharing={controls.isScreenSharing}
              isTileView={controls.isTileView}
              toggleAudio={controls.toggleAudio}
              toggleVideo={controls.toggleVideo}
              toggleShareScreen={controls.toggleShareScreen}
              toggleTileView={controls.toggleTileView}
              hangup={controls.hangup}
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              sendReaction={controls.sendReaction}
            />
            <ParticipantSidebar
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
              participants={participants}
            />
          </>
        )}
      </div>
    </div>
  );
}
