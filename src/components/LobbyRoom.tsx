
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Mic, MicOff, Video, VideoOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LobbyRoom() {
  const [displayName, setDisplayName] = useState('');
  const [isAudioMuted, setAudioMuted] = useState(true);
  const [isVideoMuted, setVideoMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const roomName = decodeURIComponent(params.roomName as string);

  useEffect(() => {
    setDisplayName(uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        separator: ' ',
        style: 'capital',
    }));
  }, []);

  const getMediaPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      // Mute audio by default on preview
      stream.getAudioTracks().forEach((track) => (track.enabled = !isAudioMuted));
      setHasPermissions(true);
      setMediaError(null);
    } catch (err: any) {
      console.error('Error accessing media devices.', err);
      let errorMessage = 'Could not access camera or microphone.';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Permissions for camera and microphone were denied. Please enable them in your browser settings to use them in the meeting.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera or microphone found. You can still join the meeting.';
      }
      setMediaError(errorMessage);
      setHasPermissions(false);
    } finally {
        setIsLoading(false);
    }
  }, [toast, isAudioMuted]);

  useEffect(() => {
    getMediaPermissions();

    return () => {
      // Stop media tracks when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [getMediaPermissions]);


  const handleJoinMeeting = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
    }
    const query = new URLSearchParams({
      displayName: displayName || 'Guest',
      audioMuted: String(isAudioMuted),
      videoMuted: String(isVideoMuted || !hasPermissions), // Mute video if no permissions
    }).toString();
    router.push(`/meeting/${params.roomName}?${query}`);
  };

  const toggleAudio = () => {
    const newAudioMuted = !isAudioMuted;
    setAudioMuted(newAudioMuted);
    if(streamRef.current){
        streamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !newAudioMuted
        });
    }
  }

  const toggleVideo = () => {
    const newVideoMuted = !isVideoMuted;
    setVideoMuted(newVideoMuted);
    if(streamRef.current){
        streamRef.current.getVideoTracks().forEach(track => {
            track.enabled = !newVideoMuted
        });
    }
  };

  const VideoPreview = () => {
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
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
                <AlertTitle>Media Error</AlertTitle>
                <AlertDescription>
                    {mediaError || "Could not access camera or microphone."}
                </AlertDescription>
            </Alert>
        </div>
      );
    }
    
    return (
        <>
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            {isVideoMuted && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <VideoOff className="h-16 w-16 text-white/50" />
                </div>
            )}
        </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Joining: {roomName}</CardTitle>
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
            <div className="space-y-2">
                <Label htmlFor="displayName" className="text-lg">Your Name</Label>
                <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-12 text-lg"
                    placeholder="Enter your name"
                />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This name will be displayed to others in the meeting.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
            <Button
              size="lg"
              className="w-full h-14 text-xl"
              onClick={handleJoinMeeting}
              disabled={!displayName}
            >
              {isLoading ? 'Loading Devices...' : 'Join Meeting'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
