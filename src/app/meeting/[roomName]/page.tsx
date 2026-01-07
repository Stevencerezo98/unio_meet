
'use client';

import MeetingRoom from '@/components/MeetingRoom';
import { useSearchParams } from 'next/navigation';
import { Suspense, use } from 'react';

function MeetingPageContent({ params }: { params: Promise<{ roomName: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const displayName = searchParams.get('displayName') || 'Guest';
  const audioMuted = searchParams.get('audioMuted') === 'true';
  const videoMuted = searchParams.get('videoMuted') === 'true';

  return (
    <main>
      <MeetingRoom
        roomName={resolvedParams.roomName}
        displayName={displayName}
        startWithAudioMuted={audioMuted}
        startWithVideoMuted={videoMuted}
      />
    </main>
  );
}

export default function MeetingPage({
  params,
}: {
  params: { roomName: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MeetingPageContent params={params} />
    </Suspense>
  );
}
