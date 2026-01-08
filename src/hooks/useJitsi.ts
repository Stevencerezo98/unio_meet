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
  domain = 'call.unio.my',
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
      },
      configOverwrite: {
        // This is the critical line to skip Jitsi's pre-join screen
        prejoinPageEnabled: false, 
        disableDeepLinking: true,
        enableWelcomePage: false,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        TOOLBAR_ALWAYS_VISIBLE: true,
      },
    };

    const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
    
    // Set avatar once the API is ready
    jitsiApi.on('videoConferenceJoined', () => {
        if(avatarUrl) {
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
  }, [roomName, domain, parentNode, displayName, avatarUrl]);
  

  return {};
}
