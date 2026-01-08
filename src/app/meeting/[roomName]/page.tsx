'use client';

import React, { use, useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import MeetingRoom from '@/components/MeetingRoom';
import { useFirebase, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

function MeetingPageContent({ roomName }: { roomName: string }) {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user || user.isAnonymous) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [displayName, setDisplayName] = useState('Invitado');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) return;

    if (user && !user.isAnonymous && userProfile) {
      setDisplayName(userProfile.displayName || user.email || 'Usuario');
      setAvatarUrl(userProfile.profilePictureUrl || undefined);
    } else if (user?.isAnonymous) {
      const anonPrefs = localStorage.getItem('unio-anonymous-prefs');
      if (anonPrefs) {
        const { displayName: anonName, avatarUrl: anonAvatar } = JSON.parse(anonPrefs);
        setDisplayName(anonName || 'Invitado');
        setAvatarUrl(anonAvatar || undefined);
      }
    }
  }, [user, isUserLoading, userProfile, isProfileLoading]);


  // We still want to make sure we have a user (even anonymous) before joining
  if (isUserLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Cargando reunión...</div>;
  }
  
  if (!user) {
    // If no user at all, redirect to start to force a sign-in flow (even anonymous)
    // This case might not be hit if your start page logic is robust
    router.replace(`/start`);
    return null;
  }

  return (
    <main>
      <MeetingRoom
        roomName={roomName}
        displayName={displayName}
        avatarUrl={avatarUrl}
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
