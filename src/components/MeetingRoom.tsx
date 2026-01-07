'use client';

import React, { useRef, useState } from 'react';
import { useJitsi } from '@/hooks/useJitsi';
import MeetingToolbar from './MeetingToolbar';
import ParticipantSidebar from './ParticipantSidebar';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MeetingRoomProps {
    roomName: string;
}

export default function MeetingRoom({ roomName }: MeetingRoomProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onMeetingEnd = () => {
    router.push('/thank-you');
  };

  const { isJoined, api, participants, controls } = useJitsi({
    roomName,
    parentNode: jitsiContainerRef,
    onMeetingEnd,
  });

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
      <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-black shadow-2xl border border-neutral-800">
        <div ref={jitsiContainerRef} className="w-full h-full" />
        
        {!isJoined && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-foreground">Joining meeting room...</p>
            </div>
        )}

        {isJoined && (
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
