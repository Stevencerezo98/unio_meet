
'use client';

import LobbyRoom from '@/components/LobbyRoom';
import { Suspense } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

function LobbyPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
      return <div className="flex min-h-screen items-center justify-center">Cargando...</div>
  }
  
  if (!user) {
      router.replace('/login');
      return null;
  }

  return <LobbyRoom />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Lobby...</div>}>
      <LobbyPage />
    </Suspense>
  );
}
