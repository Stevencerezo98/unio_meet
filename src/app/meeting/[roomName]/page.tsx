'use client';

import React, { use, useEffect } from 'react';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import MeetingRoom from '@/components/MeetingRoom';
import { useFirebase, useUser, useDoc, useMemoFirebase, initiateAnonymousSignIn } from '@/firebase';
import { doc } from 'firebase/firestore';

function MeetingPageContent({ roomName }: { roomName: string }) {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { firestore, auth } = useFirebase();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user || user.isAnonymous) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    // If auth is ready and there's no user, sign them in anonymously.
    if (auth && !isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading]);

  // The callback function to execute when the meeting ends.
  const handleMeetingEnd = () => {
    router.push('/start');
  };

  if (isUserLoading || isProfileLoading || !user) {
    return <div className="flex h-screen w-full items-center justify-center">Cargando...</div>;
  }

  const displayName = (user && !user.isAnonymous && userProfile?.displayName) ? userProfile.displayName : 'Invitado';
  const avatarUrl = (user && !user.isAnonymous && userProfile?.profilePictureUrl) ? userProfile.profilePictureUrl : undefined;

  return (
    <main>
      <MeetingRoom
        roomName={roomName}
        displayName={displayName}
        avatarUrl={avatarUrl}
        onMeetingEnd={handleMeetingEnd}
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
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Cargando...</div>}>
      <MeetingPageContent roomName={roomName} />
    </Suspense>
  );
}
