'use client';

import Link from 'next/link';
import { Video, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NavItem = ({ children, href = '#' }: { children: React.ReactNode; href?: string }) => (
  <Link href={href} className="transition-colors hover:text-primary">
    {children}
  </Link>
);

const DropdownNavItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <div className="flex items-center gap-1 cursor-pointer transition-colors hover:text-primary">
        <span>{label}</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);

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
          <DropdownNavItem label="Productos">
            <DropdownMenuItem>Reuniones</DropdownMenuItem>
            <DropdownMenuItem>Chat de Equipo</DropdownMenuItem>
            <DropdownMenuItem>Pizarra Virtual</DropdownMenuItem>
            <DropdownMenuItem>Eventos Virtuales</DropdownMenuItem>
          </DropdownNavItem>
          
          <NavItem href="#">Planes y Precios</NavItem>

          <DropdownNavItem label="Recursos">
             <DropdownMenuItem>Blog</DropdownMenuItem>
             <DropdownMenuItem>Centro de Soporte</DropdownMenuItem>
             <DropdownMenuItem>Tutoriales en Video</DropdownMenuItem>
             <DropdownMenuItem>Descargar la App</DropdownMenuItem>
          </DropdownNavItem>
          
          <NavItem href="#">Contactar a Ventas</NavItem>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost">Iniciar Sesión</Button>
          <Button>Crear Cuenta Gratis</Button>
        </div>
      </div>
    </motion.header>
  );
}
