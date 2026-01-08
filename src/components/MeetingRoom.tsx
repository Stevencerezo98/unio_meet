'use client';

import React, { useRef } from 'react';
import { useJitsi } from '@/hooks/useJitsi';
import { Loader2 } from 'lucide-react';
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

  const onMeetingEnd = () => {
    router.push('/thank-you');
  };

  const { isApiReady } = useJitsi({
    roomName: roomName,
    parentNode: jitsiContainerRef,
    onMeetingEnd,
    displayName,
    avatarUrl,
  });

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="relative w-full h-full bg-black">
        <div ref={jitsiContainerRef} className="w-full h-full" />
        
        {!isApiReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-foreground">Cargando sala de reuniones...</p>
            </div>
        )}
      </div>
    </div>
  );
}
