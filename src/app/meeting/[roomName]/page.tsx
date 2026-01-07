'use client'

import MeetingRoom from '@/components/MeetingRoom';

export default function MeetingPage({ params: { roomName } }: { params: { roomName: string } }) {
  return (
    <main>
      <MeetingRoom roomName={decodeURIComponent(roomName)} />
    </main>
  );
}
