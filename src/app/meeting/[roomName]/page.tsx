'use client'

import MeetingRoom from '@/components/MeetingRoom';
import { useSearchParams } from 'next/navigation';

export default function MeetingPage({ params }: { params: { roomName: string } }) {
  const searchParams = useSearchParams();
  const userName = searchParams.get('userName') || 'Guest';
  const roomName = decodeURIComponent(params.roomName);

  return (
    <main>
      <MeetingRoom roomName={roomName} userName={userName} />
    </main>
  );
}
