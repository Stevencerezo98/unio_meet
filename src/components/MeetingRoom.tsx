'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useJitsi } from '@/hooks/useJitsi';
import MeetingToolbar from './MeetingToolbar';
import ParticipantSidebar from './ParticipantSidebar';
import { Loader2 } from 'lucide-react';

export default function MeetingRoom() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  const roomName = useMemo(() => `Unio-Premium-Meeting-${Math.random().toString(36).substr(2, 9)}`, []);
  const userName = 'Demo User';

  const configOverwrite = {
    startWithAudioMuted: true,
    startWithVideoMuted: true,
    prejoinPageEnabled: false,
    disableDeepLinking: true,
    enableWelcomePage: false,
    transcribingEnabled: false,
    recordingService: {
        enabled: false,
    },
    liveStreaming: {
        enabled: false,
    },
    fileRecordingsEnabled: false,
  };

  const interfaceConfigOverwrite = {
    TOOLBAR_BUTTONS: [],
    SETTINGS_SECTIONS: ['devices', 'language', 'profile', 'moderator'],
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_BRAND_WATERMARK: false,
    SHOW_POWERED_BY_WATERMARK: false,
    SHOW_CHROME_EXTENSION_BANNER: false,
    TILE_VIEW_MAX_COLUMNS: 5,
    TOOLBAR_ALWAYS_VISIBLE: false,
    DISABLE_VIDEO_BACKGROUND: false,
  };

  const { api, participants, controls } = useJitsi({
    roomName,
    parentNode: jitsiContainerRef.current,
    userInfo: { displayName: userName },
    configOverwrite,
    interfaceConfigOverwrite,
  });

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
      <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-black shadow-2xl border border-neutral-800">
        <div ref={jitsiContainerRef} className="w-full h-full" />
        
        {!api && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-foreground">Joining meeting room...</p>
            </div>
        )}

        {api && (
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