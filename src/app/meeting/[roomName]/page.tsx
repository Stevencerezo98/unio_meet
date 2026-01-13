'use client';

import React, { use, useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MeetingRoom from '@/components/MeetingRoom';
import { useFirebase, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

function MeetingPageContent({ roomName }: { roomName: string }) {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user || user.isAnonymous) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isUserLoading || (user && !user.isAnonymous && isProfileLoading)) {
      return; // Wait until all user data is loaded
    }

    let finalDisplayName = 'Invitado';
    let finalAvatarUrl: string | undefined = undefined;

    if (user && !user.isAnonymous && userProfile) {
      // Registered user
      finalDisplayName = userProfile.displayName || user.email || 'Usuario';
      finalAvatarUrl = userProfile.profilePictureUrl || undefined;
    } else if (user?.isAnonymous) {
      // Anonymous user, get data from query params passed from lobby
      finalDisplayName = searchParams.get('displayName') || 'Invitado';
      const storedAvatar = sessionStorage.getItem('unio-avatar-url');
       if(storedAvatar) {
        finalAvatarUrl = storedAvatar;
      }
    } else {
      // No user, redirect to start
      router.replace(`/lobby/${roomName}`);
      return;
    }
    
    setDisplayName(finalDisplayName);
    setAvatarUrl(finalAvatarUrl);
    setIsReady(true); // Mark as ready to render MeetingRoom
    
  }, [user, isUserLoading, userProfile, isProfileLoading, searchParams, router, roomName]);


  if (!isReady) {
    return <div className="flex h-screen w-full items-center justify-center">Cargando reunión...</div>;
  }

  return (
    <main>
      <MeetingRoom
        roomName={roomName}
        displayName={displayName!}
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
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Cargando...</div>}>
      <MeetingPageContent roomName={roomName} />
    </Suspense>
  );
}
