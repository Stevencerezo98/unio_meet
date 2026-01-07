
'use client';

import LobbyRoom from '@/components/LobbyRoom';
import { Suspense } from 'react';

function LobbyPage() {
  return <LobbyRoom />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Lobby...</div>}>
      <LobbyPage />
    </Suspense>
  );
}
