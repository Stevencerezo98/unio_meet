'use client';

import React, { useRef } from 'react';
import { useJitsi } from '@/hooks/useJitsi';
import { useRouter } from 'next/navigation';

interface MeetingRoomProps {
    roomName: string;
    displayName?: string;
    avatarUrl?: string;
}

export default function MeetingRoom({ 
    roomName,
    displayName,
    avatarUrl,
}: MeetingRoomProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Define the callback function that will be executed when the meeting ends.
  const onMeetingEnd = () => {
    // Redirect the user to the thank-you page.
    router.push('/thank-you');
  };

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
