'use client'

import MeetingRoom from '@/components/MeetingRoom';
import { useSearchParams } from 'next/navigation';

export default function MeetingPage({ params }: { params: { roomName: string } }) {
  const { roomName } = params;
  const searchParams = useSearchParams();
  const userName = searchParams.get('userName') || 'Guest';

  return (
    <main>
      <MeetingRoom roomName={decodeURIComponent(roomName)} userName={userName} />
    </main>
  );
}
