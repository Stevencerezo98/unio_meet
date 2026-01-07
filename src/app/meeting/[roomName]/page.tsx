'use client';

import { use } from 'react';
import MeetingRoom from '@/components/MeetingRoom';

export default function MeetingPage({
  params,
}: {
  params: Promise<{ roomName: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <main>
      <MeetingRoom roomName={resolvedParams.roomName} />
    </main>
  );
}
