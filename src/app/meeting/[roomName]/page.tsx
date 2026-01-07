'use client'

import MeetingRoom from '@/components/MeetingRoom';
import { useSearchParams } from 'next/navigation';

export default function MeetingPage({ params }: { params: { roomName: string } }) {
  const { roomName } = params;
  
  return (
    <main>
      <MeetingRoom roomName={decodeURIComponent(roomName)} />
    </main>
  );
}
