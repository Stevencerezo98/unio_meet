'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Video } from 'lucide-react';

export default function JoinMeetingForm() {
  const [roomName, setRoomName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName) {
      router.push(`/meeting/${encodeURIComponent(roomName)}`);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-neutral-800 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Video className="h-6 w-6" />
          Unirse a una reunión
        </CardTitle>
        <CardDescription>
          Introduce un nombre de sala para iniciar o unirte a una videollamada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <Button type="submit" size="lg" className="w-full h-12 text-base">
            Unirse a la reunión
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
