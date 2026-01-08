'use client';

import { useState, useEffect, useRef } from 'react';

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
    
    parentNode.current.innerHTML = '';
    
    const decodedRoomName = decodeURIComponent(roomName);

    const options = {
      roomName: decodedRoomName,
      parentNode: parentNode.current,
      width: '100%',
      height: '100%',
      configOverwrite: {
        prejoinPageEnabled: true, // Use Jitsi's native prejoin screen
        disableDeepLinking: true, // Crucial for mobile browser experience
        enableWelcomePage: false,
      },
      interfaceConfigOverwrite: {
        // All UI customization is removed to allow the native Jitsi UI to show.
        // The branding will be handled server-side as requested.
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

    // This listener ensures that hanging up redirects correctly.
    jitsiApi.on('readyToClose', () => {
      onMeetingEndRef.current?.();
    });
    
    return () => {
      if(jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [roomName, domain, parentNode, displayName, avatarUrl]);
  

  return { isApiReady };
}
