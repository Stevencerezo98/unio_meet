
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JoinMeetingForm from '@/components/JoinMeetingForm';
import { Video, Settings, Clock, Trash } from 'lucide-react';
import Link from 'next/link';
import SplashScreen from '@/components/SplashScreen';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { useFirebase, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function StartHeader() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const isRegisteredUser = user && !user.isAnonymous;

  return (
    <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
      <Link href="/start" className="flex items-center gap-2 text-foreground">
        <Video className="h-7 w-7 text-primary" />
        <span className="text-2xl font-bold">Unio</span>
      </Link>
      
      {!isUserLoading && (
        <div className="flex items-center gap-2">
            {isRegisteredUser ? (
                 <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
                    <Settings className="h-6 w-6" />
                </Button>
            ) : (
                <>
                    <Button variant="ghost" asChild>
                        <Link href="/login">Iniciar Sesión</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/register">Crear Cuenta</Link>
                    </Button>
                </>
            )}
        </div>
      )}
    </header>
  );
}

function RecentMeetings() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();

  const historyQuery = useMemoFirebase(() => {
    // Only create a query if we have a registered user and firestore is available
    if (!user || user.isAnonymous || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'meetingHistory'),
      orderBy('joinedAt', 'desc'),
      limit(5)
    );
  }, [user, firestore]);

  const { data: meetings, isLoading } = useCollection(historyQuery);

  const handleDelete = (meetingId: string) => {
    if (!user || !firestore) return;
    const meetingDocRef = doc(firestore, 'users', user.uid, 'meetingHistory', meetingId);
    deleteDocumentNonBlocking(meetingDocRef);
  };

  const handleRejoin = (roomName: string) => {
    router.push(`/lobby/${encodeURIComponent(roomName)}`);
  }

  // Don't render anything if the user isn't a registered user
  if (!user || user.isAnonymous) {
      return null;
  }

  if (isUserLoading || isLoading) {
    return (
      <Card className="w-full max-w-md mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Reuniones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!meetings || meetings.length === 0) {
    return null; // Also don't render if there's no meeting history
  }

  return (
     <Card className="w-full max-w-md mt-8 bg-card/60 backdrop-blur-xl">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="h-5 w-5" />
                Reuniones Recientes
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3">
                {meetings.map((meeting) => (
                    <li key={meeting.id} className="flex items-center justify-between gap-2 group">
                        <div className="flex-grow min-w-0">
                            <p 
                                className="font-semibold truncate cursor-pointer hover:underline"
                                onClick={() => handleRejoin(meeting.roomName)}
                            >
                                {meeting.roomName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {meeting.joinedAt ? `hace ${formatDistanceToNow(new Date(meeting.joinedAt.seconds * 1000), { locale: es })}` : 'hace un momento'}
                            </p>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(meeting.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
  )
}

export default function StartPage() {
  const [showSplash, setShowSplash] = useState(true);
  const { isStandalone } = usePWA();
  const { isUserLoading } = useUser();

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
  
  if (isUserLoading) {
    return <SplashScreen />;
  }

  if (showSplash && !isUserLoading) {
    return <SplashScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <StartHeader />
      <div className="flex flex-col items-center">
        <JoinMeetingForm />
        <RecentMeetings />
      </div>
    </div>
  );
}
