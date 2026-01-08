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
  // Use a ref to hold the onMeetingEnd callback to avoid re-running the effect when it changes.
  const onMeetingEndRef = useRef(onMeetingEnd);
  useEffect(() => {
    onMeetingEndRef.current = onMeetingEnd;
  }, [onMeetingEnd]);

  useEffect(() => {
    // Ensure the Jitsi API is available and we have a DOM node to attach to.
    if (typeof window === 'undefined' || !window.JitsiMeetExternalAPI || !parentNode.current) {
      console.warn("Jitsi API script not loaded or parentNode not available");
      return;
    }
    
    // Clear any previous Jitsi instance
    parentNode.current.innerHTML = '';
    
    const decodedRoomName = decodeURIComponent(roomName);

    const options = {
      roomName: decodedRoomName,
      parentNode: parentNode.current,
      width: '100%',
      height: '100%',
      // We pass user info directly to Jitsi's native UI.
      userInfo: {
        displayName: displayName,
        avatar: avatarUrl, // Correctly pass the avatarUrl
      },
      // Minimal config, relying on server-side settings for branding.
      configOverwrite: {},
      interfaceConfigOverwrite: {},
    };

    // Initialize the Jitsi API.
    const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);

    // Add a listener for when the user hangs up.
    // This event fires when the meeting is terminated from the Jitsi UI.
    jitsiApi.on('readyToClose', () => {
      // Call the cleanup callback, which should handle redirection.
      onMeetingEndRef.current?.();
    });
    
    // Cleanup function to dispose of the Jitsi API instance when the component unmounts.
    return () => {
      if(jitsiApi) {
        jitsiApi.dispose();
      }
    };
    // The effect should re-run if the core meeting parameters change.
  }, [roomName, domain, parentNode, displayName, avatarUrl]);
  

  // This hook no longer needs to return a loading state, as Jitsi handles its own UI.
  return {};
}
