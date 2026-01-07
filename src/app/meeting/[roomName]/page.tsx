
'use client';

import MeetingRoom from '@/components/MeetingRoom';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useUserSettings } from '@/hooks/use-user-settings';

function MeetingPageContent({ params }: { params: { roomName: string } }) {
  const searchParams = useSearchParams();
  const [settings] = useUserSettings();

  const audioMuted = searchParams.get('audioMuted') === 'true';
  const videoMuted = searchParams.get('videoMuted') === 'true';

  return (
    <main>
      <MeetingRoom
        roomName={params.roomName}
        displayName={settings.name}
        avatarUrl={settings.avatar}
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
