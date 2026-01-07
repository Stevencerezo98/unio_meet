
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JoinMeetingForm from '@/components/JoinMeetingForm';
import { Video, Settings } from 'lucide-react';
import Link from 'next/link';
import SplashScreen from '@/components/SplashScreen';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';

function StartHeader() {
  const router = useRouter();
  const headerLink = '/start';

  return (
    <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
      <Link href={headerLink} className="flex items-center gap-2 text-foreground">
        <Video className="h-7 w-7 text-primary" />
        <span className="text-2xl font-bold">Unio</span>
      </Link>
      <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
        <Settings className="h-6 w-6" />
      </Button>
    </header>
  );
}

export default function StartPage() {
  const [showSplash, setShowSplash] = useState(true);
  const { isStandalone } = usePWA();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
        router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (isStandalone) {
      if (sessionStorage.getItem('splashShown')) {
        setShowSplash(false);
      } else {
        const splashTimer = setTimeout(() => {
          setShowSplash(false);
          sessionStorage.setItem('splashShown', 'true');
        }, 2000);
        return () => clearTimeout(splashTimer);
      }
    } else {
        setShowSplash(false);
    }
  }, [isStandalone]);
  
  if (isUserLoading || !user) {
    return <SplashScreen />;
  }

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
