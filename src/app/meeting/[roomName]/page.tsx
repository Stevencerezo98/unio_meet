
'use client';

import MeetingRoom from '@/components/MeetingRoom';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useUser, useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';


function MeetingPageContent({ params }: { params: { roomName: string } }) {
  const searchParams = useSearchParams();
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const audioMuted = searchParams.get('audioMuted') === 'true';
  const videoMuted = searchParams.get('videoMuted') === 'true';
  
  if (isUserLoading || isProfileLoading) {
      return <div className="flex h-screen w-full items-center justify-center">Cargando reunión...</div>;
  }
  
  if (!user) {
      router.replace('/login');
      return null;
  }


  return (
    <main>
      <MeetingRoom
        roomName={params.roomName}
        displayName={userProfile?.displayName}
        avatarUrl={userProfile?.profilePictureUrl}
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
