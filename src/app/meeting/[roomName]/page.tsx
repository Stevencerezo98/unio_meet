'use client'

import MeetingRoom from '@/components/MeetingRoom';

export default function MeetingPage({ params }: { params: { roomName: string } }) {
  return (
    <main>
      <MeetingRoom roomName={decodeURIComponent(params.roomName)} />
    </main>
  );
}
