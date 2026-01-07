
'use client';

import MeetingRoom from '@/components/MeetingRoom';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';


function MeetingPageContent({ params }: { params: { roomName: string } }) {
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  // For all users (registered or anonymous), we get displayName and avatarUrl from URL params.
  const displayName = searchParams.get('displayName') || 'Invitado';
  const avatarUrl = searchParams.get('avatarUrl') || undefined;

  const audioMuted = searchParams.get('audioMuted') === 'true';
  const videoMuted = searchParams.get('videoMuted') === 'true';
  
  // We still want to make sure we have a user (even anonymous) before joining
  if (isUserLoading) {
      return <div className="flex h-screen w-full items-center justify-center">Cargando reunión...</div>;
  }
  
  // Though the lobby should handle this, it's a good failsafe.
  // In a real-world scenario, the lobby would have already created an anonymous session.
  if (!user) {
      router.replace(`/lobby/${params.roomName}`);
      return null;
  }

  return (
    <main>
      <MeetingRoom
        roomName={params.roomName}
        displayName={displayName}
        avatarUrl={avatarUrl}
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
