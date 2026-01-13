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
    if (auth && !isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading]);

  const handleMeetingEnd = () => {
    router.push('/start');
  };

  const isLoading = isUserLoading || (user && !user.isAnonymous && isProfileLoading);
  
  if (isLoading || !user) {
    return <div className="flex h-screen w-full items-center justify-center">Cargando reunión...</div>;
  }

  const isRegisteredUser = !user.isAnonymous;
  const displayName = isRegisteredUser ? (userProfile?.displayName || 'Usuario Registrado') : 'Invitado';
  const avatarUrl = isRegisteredUser ? userProfile?.profilePictureUrl : undefined;

  return (
    <main>
      <MeetingRoom
        roomName={roomName}
        displayName={displayName}
        avatarUrl={avatarUrl}
        onMeetingEnd={handleMeetingEnd}
        isRegisteredUser={isRegisteredUser}
      />
    </main>
  );
}

export default function MeetingPage({
  params,
}: {
  params: Promise<{ roomName: string }>;
}) {
  const { roomName } = use(params);

  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Cargando...</div>}>
      <MeetingPageContent roomName={roomName} />
    </Suspense>
  );
}
