
'use client';

import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Mic, MicOff, Video, VideoOff, Loader2, AlertCircle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirebase, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection, serverTimestamp } from 'firebase/firestore';
import { updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const ANONYMOUS_PREFS_KEY = 'unio-anonymous-prefs';
const AVATAR_SESSION_KEY = 'unio-avatar-url';

interface AnonymousPrefs {
    displayName: string;
    avatarUrl: string | null;
    isAudioMuted: boolean;
    isVideoMuted: boolean;
}

export default function LobbyRoom() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user || user.isAnonymous) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAudioMuted, setAudioMuted] = useState(true);
  const [isVideoMuted, setVideoMuted] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const params = useParams();

  const roomName = decodeURIComponent(params.roomName as string);

  // Load preferences on component mount
  useEffect(() => {
    if (isProfileLoading) return; // Wait until we know if we have a profile

    if (user && !user.isAnonymous && userProfile) {
      // Registered user: load from Firestore profile
      setDisplayName(userProfile.displayName || '');
      setAvatarUrl(userProfile.profilePictureUrl || null);
      setAudioMuted(userProfile.defaultAudioMuted !== undefined ? userProfile.defaultAudioMuted : true);
      setVideoMuted(userProfile.defaultVideoMuted !== undefined ? userProfile.defaultVideoMuted : false);
    } else if (user) {
      // Anonymous user: load from localStorage
      try {
        const savedPrefs = localStorage.getItem(ANONYMOUS_PREFS_KEY);
        if (savedPrefs) {
          const { displayName, avatarUrl, isAudioMuted, isVideoMuted } = JSON.parse(savedPrefs) as AnonymousPrefs;
          setDisplayName(displayName);
          setAvatarUrl(avatarUrl);
          setAudioMuted(isAudioMuted);
          setVideoMuted(isVideoMuted);
        } else {
          setDisplayName('Invitado');
        }
      } catch (e) {
          console.error("Failed to parse anonymous preferences", e);
          setDisplayName('Invitado');
      }
    }
  }, [userProfile, isProfileLoading, user]);


  const getMediaPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      stream.getAudioTracks().forEach((track) => (track.enabled = !isAudioMuted));
      stream.getVideoTracks().forEach((track) => (track.enabled = !isVideoMuted));
      setHasPermissions(true);
      setMediaError(null);
    } catch (err: any) {
      console.error('Error accessing media devices.', err);
      let errorMessage = 'No se pudo acceder a la cámara o al micrófono.';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Permisos denegados. Por favor, habilítalos en los ajustes de tu navegador.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No se encontró cámara o micrófono. Aún puedes unirte a la reunión.';
      }
      setMediaError(errorMessage);
      setHasPermissions(false);
    } finally {
        setIsLoading(false);
    }
  }, [isAudioMuted, isVideoMuted]);

  useEffect(() => {
    getMediaPermissions();
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [getMediaPermissions]);


  const handleJoinMeeting = () => {
    // 1. Save preferences
    if (user && !user.isAnonymous && userDocRef) {
      // Registered user: Save display name and avatar (preferences are saved on settings page)
      updateDocumentNonBlocking(userDocRef, { 
          displayName: displayName,
          profilePictureUrl: avatarUrl || ''
      });
       if (firestore) {
          const historyColRef = collection(firestore, 'users', user.uid, 'meetingHistory');
          addDocumentNonBlocking(historyColRef, {
            roomName: roomName,
            joinedAt: serverTimestamp(),
          });
        }
    } else {
      // Anonymous user: Save all settings to localStorage
      const prefsToSave: AnonymousPrefs = { displayName, avatarUrl, isAudioMuted, isVideoMuted };
      localStorage.setItem(ANONYMOUS_PREFS_KEY, JSON.stringify(prefsToSave));
    }
    
    // 2. Stop media tracks
    streamRef.current?.getTracks().forEach((track) => track.stop());

    // 3. Save avatar to session storage before navigating
    if (avatarUrl) {
      try {
        sessionStorage.setItem(AVATAR_SESSION_KEY, avatarUrl);
      } catch (e) {
        console.error("Could not save avatar to session storage", e);
      }
    } else {
        sessionStorage.removeItem(AVATAR_SESSION_KEY);
    }

    // 4. Navigate to meeting with clean URL
    const query = new URLSearchParams({
      audioMuted: String(isAudioMuted),
      videoMuted: String(isVideoMuted || !hasPermissions),
      displayName: displayName,
    });
    
    router.push(`/meeting/${params.roomName}?${query.toString()}`);
  };

  const toggleAudio = () => {
    const newAudioMuted = !isAudioMuted;
    setAudioMuted(newAudioMuted);
    streamRef.current?.getAudioTracks().forEach(track => { track.enabled = !newAudioMuted });
  }

  const toggleVideo = () => {
    const newVideoMuted = !isVideoMuted;
    setVideoMuted(newVideoMuted);
    streamRef.current?.getVideoTracks().forEach(track => { track.enabled = !newVideoMuted });
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setAvatarUrl(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const VideoPreview = () => {
    if (isLoading || isProfileLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (!hasPermissions) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 p-4 text-center">
            <VideoOff className="h-16 w-16 text-muted-foreground mb-4" />
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error de Medios</AlertTitle>
                <AlertDescription>
                    {mediaError}
                </AlertDescription>
            </Alert>
        </div>
      );
    }
    
    return (
        <>
            <video ref={videoRef} className={`w-full h-full object-cover transition-opacity ${isVideoMuted ? 'opacity-0' : 'opacity-100'}`} autoPlay muted playsInline />
            <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${isVideoMuted ? 'opacity-100' : 'opacity-0'}`}>
                <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-background">
                        <AvatarImage src={avatarUrl ?? undefined} />
                        <AvatarFallback className="text-4xl">
                            {displayName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Entrando a: {roomName}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-video rounded-lg bg-muted overflow-hidden border">
            <VideoPreview />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                <Button variant={isAudioMuted ? 'destructive' : 'secondary'} size="icon" className="rounded-full h-12 w-12" onClick={toggleAudio} disabled={!hasPermissions}>
                    {isAudioMuted ? <MicOff /> : <Mic />}
                </Button>
                 <Button variant={isVideoMuted ? 'destructive' : 'secondary'} size="icon" className="rounded-full h-12 w-12" onClick={toggleVideo} disabled={!hasPermissions}>
                    {isVideoMuted ? <VideoOff /> : <Video />}
                </Button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
                <Label htmlFor="displayName" className="text-lg">Tu Nombre y Avatar</Label>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="h-16 w-16 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <AvatarImage src={avatarUrl ?? undefined} />
                            <AvatarFallback className="text-2xl">
                                {displayName?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 border-2 border-background cursor-pointer" onClick={() => fileInputrodent?.click()}>
                           <Pencil className="h-3 w-3" />
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleAvatarChange} 
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                        />
                    </div>
                    <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="h-12 text-lg"
                        placeholder="Introduce tu nombre"
                    />
                </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Este nombre y avatar se mostrarán a los demás y se guardarán para tu próxima visita.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
            <Button
              size="lg"
              className="w-full h-14 text-xl"
              onClick={handleJoinMeeting}
              disabled={!displayName || (user && !user.isAnonymous && isProfileLoading) || isLoading}
            >
              {isProfileLoading || isLoading ? 'Cargando...' : 'Unirse a la Reunión'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
