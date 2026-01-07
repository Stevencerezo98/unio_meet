'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { Video } from 'lucide-react';

export default function Home() {
  const [roomName, setRoomName] = useState('');
  const router = useRouter();

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName) {
      router.push(`/meeting/${encodeURIComponent(roomName)}`);
    }
  };

  const handleInstantMeeting = () => {
    const randomName: string = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
      length: 2,
    });
    const generatedRoomName = `${randomName}-${Math.floor(1000 + Math.random() * 9000)}`;
    router.push(`/meeting/${encodeURIComponent(generatedRoomName)}`);
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full filter blur-[200px] -translate-x-1/2 -translate-y-1/2 opacity-50 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full filter blur-[150px] opacity-60 animate-pulse animation-delay-2000" />
      </div>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          {/* Left Column: Hero Text */}
          <div className="text-center md:text-left">
            <motion.h1
              className="text-5xl font-bold tracking-tight md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Reuniones privadas,{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent/80">
                sin fronteras
              </span>
              .
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Videollamadas simples y seguras, alojadas en nuestra propia infraestructura para máxima privacidad. Sin registros, sin rastreo.
            </motion.p>
          </div>

          {/* Right Column: Join Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="w-full max-w-md shadow-2xl border-neutral-800 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Video className="h-6 w-6 text-primary" />
                  Crear o unirse
                </CardTitle>
                <CardDescription>
                  Introduce un nombre de sala o inicia una reunión instantánea.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleJoinMeeting} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomName">Nombre de la Sala</Label>
                    <Input
                      id="roomName"
                      type="text"
                      placeholder="ej: reunion-semanal"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-12 text-base" disabled={!roomName}>
                    Unirse a la Reunión
                  </Button>
                </form>
                
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

                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full h-12 text-base"
                  onClick={handleInstantMeeting}
                >
                  Iniciar Reunión Instantánea
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}