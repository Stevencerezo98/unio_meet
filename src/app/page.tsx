'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator';

const features = [
  {
    icon: ShieldCheck,
    title: 'Seguridad Encriptada',
    description:
      'Tus conversaciones son privadas. Con encriptación de extremo a extremo, nadie más puede unirse o escucharlas.',
  },
  {
    icon: Zap,
    title: 'Sin Instalación',
    description:
      'Olvídate de descargar apps. Unio funciona directamente en tu navegador, en cualquier dispositivo.',
  },
  {
    icon: Code,
    title: 'Interfaz Minimalista',
    description:
      'Nos centramos en lo importante: una interfaz limpia y rápida para que tus reuniones fluyan sin distracciones.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Home() {
  const router = useRouter();

  const handleInstantMeeting = () => {
    const randomName: string = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
      length: 2,
    });
    const roomName = `${randomName}-${Math.floor(1000 + Math.random() * 9000)}`;
    router.push(`/meeting/${encodeURIComponent(roomName)}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 animated-gradient -z-10"></div>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tight md:text-7xl"
          >
            Reuniones privadas,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              sin fronteras
            </span>
            .
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Alojado en nuestra propia infraestructura Linode para una máxima
            privacidad. Sin registros, sin rastreo. Solo videollamadas simples y
            seguras.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-12 text-base px-8 w-full sm:w-auto"
              onClick={handleInstantMeeting}
            >
              Iniciar Reunión Instantánea
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 text-base px-8 w-full sm:w-auto"
              disabled
            >
              Agendar para después
            </Button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="mt-12 w-fit bg-white/5 backdrop-blur-xl border-white/10 p-2 text-xs text-muted-foreground flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Calidad de red: Excelente
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative z-10 mt-24 w-full max-w-5xl"
        >
          <h2 className="text-3xl font-bold">Por qué elegir Unio</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="bg-white/5 backdrop-blur-xl border-white/10 text-left p-6"
              >
                <div className="flex items-center gap-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="mt-4 text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
