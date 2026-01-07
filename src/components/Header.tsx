'use client';

import Link from 'next/link';
import { Video } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto flex items-center justify-between p-4 text-foreground">
        <Link href="/" className="flex items-center gap-2">
          <Video className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold">Unio</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#" className="transition-colors hover:text-primary">Home</Link>
          <Link href="#" className="transition-colors hover:text-primary">Precios</Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost">Iniciar Sesión</Button>
          <Button>Crear Cuenta</Button>
        </div>
      </div>
    </motion.header>
  );
}
