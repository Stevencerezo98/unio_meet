'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, ShieldCheck, Zap, Lock, TvMinimal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

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
    const generatedRoomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '-',
      length: 3,
    });
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    router.push(`/meeting/${encodeURIComponent(`${generatedRoomName}-${randomSuffix}`)}`);
  };
  
  const handleScheduleMeeting = () => {
    // Placeholder for scheduling functionality
    alert('La función para agendar reuniones estará disponible próximamente.');
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };


  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background text-foreground">
      <Header />
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full filter blur-[200px] -translate-x-1/2 -translate-y-1/2 opacity-50 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full filter blur-[150px] opacity-60 animate-pulse animation-delay-2000" />
      </div>

      <main className="container mx-auto flex flex-grow flex-col items-center justify-center p-4 pt-32 pb-16">
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
                  Inicia una reunión instantánea o únete con un nombre de sala.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                 <Button
                  size="lg"
                  className="w-full h-12 text-base"
                  onClick={handleInstantMeeting}
                >
                  Iniciar Reunión Instantánea
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full h-12 text-base"
                  onClick={handleScheduleMeeting}
                >
                  Agendar para después
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      O introduce un nombre de sala
                    </span>
                  </div>
                </div>

                <form onSubmit={handleJoinMeeting} className="flex gap-2">
                    <Input
                      id="roomName"
                      type="text"
                      placeholder="ej: reunion-semanal"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="h-12 text-base flex-grow"
                    />
                  <Button type="submit" size="lg" className="h-12 text-base" disabled={!roomName}>
                    Unirse
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Social Proof Section */}
        <motion.section 
          className="mt-32 w-full max-w-5xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <h2 className="text-4xl font-bold">Por qué elegir Unio</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Una plataforma diseñada para ser simple, segura y respetuosa con tu privacidad.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <motion.div variants={featureVariants} className="flex flex-col items-center p-6 border border-neutral-800 rounded-lg bg-white/5">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Lock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Seguridad Encriptada</h3>
              <p className="mt-2 text-muted-foreground">
                Todas las llamadas están protegidas con encriptación de extremo a extremo. Tu conversación es solo tuya.
              </p>
            </motion.div>
            <motion.div variants={featureVariants} className="flex flex-col items-center p-6 border border-neutral-800 rounded-lg bg-white/5">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Sin Instalación</h3>
              <p className="mt-2 text-muted-foreground">
                Únete a reuniones directamente desde tu navegador en cualquier dispositivo. Sin descargas, sin complicaciones.
              </p>
            </motion.div>
            <motion.div variants={featureVariants} className="flex flex-col items-center p-6 border border-neutral-800 rounded-lg bg-white/5">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <TvMinimal className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Interfaz Minimalista</h3>
              <p className="mt-2 text-muted-foreground">
                Una experiencia limpia y sin distracciones, centrada en lo que más importa: la comunicación.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
