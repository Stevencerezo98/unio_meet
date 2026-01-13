'use client';

import React, { useRef } from 'react';
import { useJitsi } from '@/hooks/useJitsi';

interface MeetingRoomProps {
    roomName: string;
    displayName?: string;
    avatarUrl?: string;
    onMeetingEnd?: () => void;
}

export default function MeetingRoom({ 
    roomName,
    displayName,
    avatarUrl,
    onMeetingEnd,
}: MeetingRoomProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  // Initialize the Jitsi meeting using the custom hook.
  useJitsi({
    roomName: roomName,
    parentNode: jitsiContainerRef,
    onMeetingEnd,
    displayName,
    avatarUrl,
  });

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      {/* This div is the container where the Jitsi meeting iframe will be injected. */}
      <div ref={jitsiContainerRef} className="w-full h-full" />
    </div>
  );
}
