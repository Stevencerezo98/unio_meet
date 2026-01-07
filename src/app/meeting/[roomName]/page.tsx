'use client'

import MeetingRoom from '@/components/MeetingRoom';
import { useSearchParams } from 'next/navigation';

export default function MeetingPage({ params }: { params: { roomName: string } }) {
  const searchParams = useSearchParams();
  const userName = searchParams.get('userName') || 'Guest';

  return (
    <main>
      <MeetingRoom roomName={params.roomName} userName={userName} />
    </main>
  );
}
