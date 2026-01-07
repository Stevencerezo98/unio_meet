
'use client';

import LobbyRoom from '@/components/LobbyRoom';
import { Suspense, useEffect } from 'react';
import { useUser, useFirebase, initiateAnonymousSignIn } from '@/firebase';
import { useRouter } from 'next/navigation';

function LobbyPage() {
  const { user, isUserLoading } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    // If auth is ready and there's no user, sign them in anonymously.
    if (auth && !isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading]);


  // Show a loading screen while checking auth state or during anonymous sign-in.
  if (isUserLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
  }

  // Once we have a user (registered or anonymous), render the lobby.
  return <LobbyRoom />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Lobby...</div>}>
      <LobbyPage />
    </Suspense>
  );
}
