'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Video } from 'lucide-react';

export default function JoinMeetingForm() {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && roomName) {
      router.push(`/meeting/${encodeURIComponent(roomName)}?userName=${encodeURIComponent(userName)}`);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-neutral-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
            <Video className="h-6 w-6"/>
            Join a Meeting
        </CardTitle>
        <CardDescription>Enter your details to start or join a video call.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userName">Your Name</Label>
            <Input
              id="userName"
              type="text"
              placeholder="E.g., Jane Doe"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              type="text"
              placeholder="E.g., team-sync"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="w-full h-12 text-base">
            Join Meeting
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
