'use client';

import React, { useRef } from 'react';
import { useJitsi } from '@/hooks/useJitsi';

interface MeetingRoomProps {
    roomName: string;
    displayName?: string;
    avatarUrl?: string;
    onMeetingEnd?: () => void;
    isRegisteredUser?: boolean;
}

export default function MeetingRoom({ 
    roomName,
    displayName,
    avatarUrl,
    onMeetingEnd,
    isRegisteredUser,
}: MeetingRoomProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  useJitsi({
    roomName: roomName,
    parentNode: jitsiContainerRef,
    onMeetingEnd,
    displayName,
    avatarUrl,
    isRegisteredUser,
  });

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div ref={jitsiContainerRef} className="w-full h-full" />
    </div>
  );
}
