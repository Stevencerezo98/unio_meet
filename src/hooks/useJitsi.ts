'use client';

import { useEffect, useRef } from 'react';

interface UseJitsiProps {
  roomName: string;
  parentNode: React.RefObject<HTMLDivElement>;
  domain?: string;
  onMeetingEnd?: () => void;
  displayName?: string;
  avatarUrl?: string;
}

export function useJitsi({
  roomName,
  parentNode,
  domain = 'call.unio.my', // Correct: Point to the Jitsi engine domain
  onMeetingEnd,
  displayName,
  avatarUrl,
}: UseJitsiProps) {
  const onMeetingEndRef = useRef(onMeetingEnd);
  useEffect(() => {
    onMeetingEndRef.current = onMeetingEnd;
  }, [onMeetingEnd]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.JitsiMeetExternalAPI || !parentNode.current) {
      console.warn("Jitsi API script not loaded or parentNode not available");
      return;
    }
    
    parentNode.current.innerHTML = '';
    
    const decodedRoomName = decodeURIComponent(roomName);

    const options = {
      roomName: decodedRoomName,
      parentNode: parentNode.current,
      width: '100%',
      height: '100%',
      userInfo: {
        displayName: displayName,
        avatar: avatarUrl
      },
      configOverwrite: {
        // Correct way to set the share link domain
        INVITE_DOMAIN: 'iglesia.unio.my',
        // Critical: Ensure invite links point to our app, not the Jitsi instance
        disableDeepLinking: true,
        prejoinPageEnabled: true,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        // Hide the Deep Linking section in settings to avoid user confusion
        SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'sounds'],
      }
    };

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
    
    jitsiApi.on('readyToClose', () => {
      onMeetingEndRef.current?.();
    });
    
    return () => {
      if(jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [roomName, domain, parentNode, displayName, avatarUrl]);
  

  return {};
}
