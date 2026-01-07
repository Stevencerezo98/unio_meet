'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Video } from 'lucide-react';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

export default function JoinMeetingForm() {
  const [roomName, setRoomName] = useState('');
  const router = useRouter();

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName) {
      router.push(`/meeting/${encodeURIComponent(roomName)}`);
    }
  };

  const handleInstantMeeting = () => {
    const generatedRoomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '-',
      length: 3,
    });
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    router.push(`/meeting/${encodeURIComponent(`${generatedRoomName}-${randomSuffix}`)}`);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-neutral-800 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Video className="h-6 w-6 text-primary" />
          Crear o unirse
        </CardTitle>
        <CardDescription>
          Inicia una reunión instantánea o únete con un nombre de sala.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          size="lg"
          className="w-full h-12 text-base"
          onClick={handleInstantMeeting}
        >
          Iniciar Reunión Instantánea
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              O
            </span>
          </div>
        </div>

        <form onSubmit={handleJoinSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Nombre de la Sala</Label>
            <Input
              id="roomName"
              type="text"
              placeholder="ej: reunion-equipo"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="w-full h-12 text-base" disabled={!roomName}>
            Unirse a la reunión
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
