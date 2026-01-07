
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
  const avatarUrl = searchParams.get('avatarUrl');

  return (
    <main>
      <MeetingRoom
        roomName={resolvedParams.roomName}
        displayName={displayName}
        startWithAudioMuted={audioMuted}
        startWithVideoMuted={videoMuted}
        avatarUrl={avatarUrl || undefined}
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
