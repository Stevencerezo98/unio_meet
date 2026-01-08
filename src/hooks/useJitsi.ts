
'use client';

import { useState, useEffect, useRef } from 'react';
import type { JitsiApi } from '@/lib/types';

interface UseJitsiProps {
  roomName: string;
  parentNode: React.RefObject<HTMLDivElement>;
  domain?: string;
  onMeetingEnd?: () => void;
  displayName?: string;
  avatarUrl?: string;
  startWithAudioMuted?: boolean;
  startWithVideoMuted?: boolean;
}

export function useJitsi({
  roomName,
  parentNode,
  domain = 'call.unio.my',
  onMeetingEnd,
  displayName,
  avatarUrl,
  startWithAudioMuted = true,
  startWithVideoMuted = true,
}: UseJitsiProps) {
  const [isApiReady, setApiReady] = useState(false);
  const onMeetingEndRef = useRef(onMeetingEnd);
  
  useEffect(() => {
    onMeetingEndRef.current = onMeetingEnd;
  }, [onMeetingEnd]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.JitsiMeetExternalAPI || !parentNode.current) {
      return;
    }
    
    const decodedRoomName = decodeURIComponent(roomName);

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, {
      roomName: decodedRoomName,
      parentNode: parentNode.current,
      width: '100%',
      height: '100%',
      configOverwrite: {
        // CRUCIAL: Disable Jitsi's own prejoin page to avoid conflicts with our lobby
        prejoinPageEnabled: false, 
        startWithAudioMuted: startWithAudioMuted,
        startWithVideoMuted: startWithVideoMuted,
        disableDeepLinking: true,
        enableWelcomePage: false,
        transcribingEnabled: false,
        recordingService: { enabled: false },
        liveStreaming: { enabled: false },
        fileRecordingsEnabled: false,
      },
      interfaceConfigOverwrite: {
        // --- Branding Removal ---
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_POWERED_BY_WATERMARK: false,
        JITSI_WATERMARK_LINK: '',
        BRAND_WATERMARK_LINK: '',
        SHOW_POWERED_BY: false,
        
        // --- UI Customization ---
        SETTINGS_SECTIONS: ['devices', 'language', 'profile', 'moderator'],
        SHOW_CHROME_EXTENSION_BANNER: false,
        TILE_VIEW_MAX_COLUMNS: 5,
        DISABLE_VIDEO_BACKGROUND: false,
      },
      onload: () => {
        setApiReady(true);
      }
    });

    jitsiApi.on('videoConferenceJoined', () => {
       if (displayName) {
        jitsiApi.executeCommand('displayName', displayName);
      }
      if (avatarUrl) {
        jitsiApi.executeCommand('avatarUrl', avatarUrl);
      }
    });

    jitsiApi.on('readyToClose', () => {
      onMeetingEndRef.current?.();
    });
    
    return () => {
      if(jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [roomName, domain, parentNode, startWithAudioMuted, startWithVideoMuted, displayName, avatarUrl]);
  

  return { isApiReady };
}
