'use client';

import { useState, useEffect } from 'react';
import JoinMeetingForm from '@/components/JoinMeetingForm';
import { Video } from 'lucide-react';
import Link from 'next/link';
import SplashScreen from '@/components/SplashScreen';
import { usePWA } from '@/hooks/usePWA';

function StartHeader() {
  // Always link to /start from the start page header.
  const headerLink = '/start';

  return (
    <header className="absolute top-0 left-0 right-0 p-4">
      <Link href={headerLink} className="flex items-center gap-2 text-foreground">
        <Video className="h-7 w-7 text-primary" />
        <span className="text-2xl font-bold">Unio</span>
      </Link>
    </header>
  );
}

export default function StartPage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if the splash screen was already shown in this session
    if (sessionStorage.getItem('splashShown')) {
      setShowSplash(false);
    } else {
      const splashTimer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splashShown', 'true');
      }, 2000);
      return () => clearTimeout(splashTimer);
    }
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <StartHeader />
      <JoinMeetingForm />
    </div>
  );
}
