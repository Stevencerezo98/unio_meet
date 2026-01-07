
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, ShieldCheck, Zap, TvMinimal, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { LandingContent } from '@/lib/landing-content';
import { loadLandingContent, generateRandomRoomName } from '@/app/actions';


const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Lock: Lock,
  Zap: Zap,
  TvMinimal: TvMinimal,
  ShieldCheck: ShieldCheck,
};

export default function Home() {
  const [roomName, setRoomName] = useState('');
  const router = useRouter();
  const [content, setContent] = useState<LandingContent | null>(null);

  useEffect(() => {
    async function fetchContent() {
      const landingContent = await loadLandingContent();
      setContent(landingContent);
    }
    fetchContent();
  }, []);


  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName) {
      router.push(`/lobby/${encodeURIComponent(roomName)}`);
    }
  };

  const handleInstantMeeting = async () => {
    const generatedRoomName = await generateRandomRoomName();
    router.push(`/lobby/${encodeURIComponent(generatedRoomName)}`);
  };

  const handleScheduleMeeting = () => {
    alert('La función para agendar reuniones estará disponible próximamente.');
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const { header, hero, features, footer } = content;

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background text-foreground">
      <Header content={header} />
      
      <main className="container mx-auto flex flex-grow flex-col items-center justify-center p-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div className="text-center md:text-left">
            <motion.h1
              className="text-5xl font-bold tracking-tight md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {hero.titlePart1}{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground/80">{hero.titlePart2}</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {hero.subtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="w-full max-w-md shadow-2xl border-border bg-card/60 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Video className="h-6 w-6 text-primary" />
                  {hero.cardTitle}
                </CardTitle>
                <CardDescription>
                  {hero.cardDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                 <Button
                  size="lg"
                  className="w-full h-12 text-base"
                  onClick={handleInstantMeeting}
                >
                  {hero.ctaPrimary}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full h-12 text-base"
                  onClick={handleScheduleMeeting}
                >
                  {hero.ctaSecondary}
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

        <motion.section 
          className="mt-32 w-full max-w-5xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <h2 className="text-4xl font-bold">{features.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {features.subtitle}
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {features.items.map((feature, index) => {
                const Icon = iconMap[feature.icon] || Lock;
                return(
                    <motion.div key={index} variants={featureVariants} className="flex flex-col items-center p-6 border rounded-lg bg-card/60">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                            <Icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <p className="mt-2 text-muted-foreground">
                            {feature.description}
                        </p>
                    </motion.div>
                )
            })}
          </div>
        </motion.section>
      </main>
      <Footer content={footer} />
    </div>
  );
}
