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
  domain = 'iglesia.unio.my',
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
        disableDeepLinking: true,
      },
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
