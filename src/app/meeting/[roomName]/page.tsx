
'use client';

import MeetingRoom from '@/components/MeetingRoom';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, use } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

const AVATAR_SESSION_KEY = 'unio-avatar-url';

function MeetingPageContent({ roomName }: { roomName: string }) {
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  // We need to read from sessionStorage in a useEffect to ensure it runs on the client.
  useEffect(() => {
    try {
      const storedAvatar = sessionStorage.getItem(AVATAR_SESSION_KEY);
      if (storedAvatar) {
        setAvatarUrl(storedAvatar);
        // Clean up the session storage after reading
        sessionStorage.removeItem(AVATAR_SESSION_KEY);
      }
    } catch (e) {
      console.error("Could not read avatar from session storage", e);
    }
  }, []);

  // Get other details from URL params as before.
  const displayName = searchParams.get('displayName') || 'Invitado';
  const audioMuted = searchParams.get('audioMuted') === 'true';
  const videoMuted = searchParams.get('videoMuted') === 'true';
  
  // We still want to make sure we have a user (even anonymous) before joining
  if (isUserLoading) {
      return <div className="flex h-screen w-full items-center justify-center">Cargando reunión...</div>;
  }
  
  // Though the lobby should handle this, it's a good failsafe.
  // In a real-world scenario, the lobby would have already created an anonymous session.
  if (!user) {
      router.replace(`/lobby/${roomName}`);
      return null;
  }

  return (
    <main>
      <MeetingRoom
        roomName={roomName}
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
  params: Promise<{ roomName: string }>;
}) {
  // React.use() unwraps the promise returned by Next.js 15 for params
  const { roomName } = use(params);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MeetingPageContent roomName={roomName} />
    </Suspense>
  );
}
