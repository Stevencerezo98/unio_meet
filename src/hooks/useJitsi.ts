
'use client';

import { useState, useEffect, useRef } from 'react';

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
      console.warn("Jitsi API script not loaded or parentNode not available");
      return;
    }
    
    // Ensure parent node is empty before creating a new Jitsi instance
    parentNode.current.innerHTML = '';
    
    const decodedRoomName = decodeURIComponent(roomName);

    const options = {
      roomName: decodedRoomName,
      parentNode: parentNode.current,
      width: '100%',
      height: '100%',
      configOverwrite: {
        prejoinPageEnabled: false,
        startWithAudioMuted,
        startWithVideoMuted,
        disableDeepLinking: true,
        enableWelcomePage: false,
        transcribingEnabled: false,
        recordingService: { enabled: false },
        liveStreaming: { enabled: false },
        fileRecordingsEnabled: false,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_POWERED_BY_WATERMARK: false,
        JITSI_WATERMARK_LINK: '',
        BRAND_WATERMARK_LINK: '',
        SHOW_POWERED_BY: false,
        SETTINGS_SECTIONS: ['devices', 'language', 'profile', 'moderator'],
        SHOW_CHROME_EXTENSION_BANNER: false,
        TILE_VIEW_MAX_COLUMNS: 5,
        DISABLE_VIDEO_BACKGROUND: false,
      },
      userInfo: {
        displayName: displayName,
        avatar: avatarUrl,
      },
      onload: () => {
        setApiReady(true);
      }
    };

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
    
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
