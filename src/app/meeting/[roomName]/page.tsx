'use client'

import MeetingRoom from '@/components/MeetingRoom';

export default function MeetingPage({ params }: { params: { roomName: string } }) {
  return (
    <main>
      <MeetingRoom roomName={params.roomName} />
    </main>
  );
}
