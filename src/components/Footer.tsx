'use client';

import Link from 'next/link';
import { Video, Facebook, Instagram, MessageCircle } from 'lucide-react';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
    {children}
  </Link>
);

// Custom TikTok Icon as it's not in lucide-react
const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12.52.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.65 4.31 1.7.03 1.31-.01 2.61-.02 3.91-.19.01-.38.02-.57.02-1.55.01-3.1-.48-4.36-1.5-1.25-1.02-1.95-2.5-1.95-4.04 0-.19.01-.38.02-.57z"/>
      <path d="M10 15.25a5.25 5.25 0 0 0 5.25 5.25V23a8 8 0 0 1-8-8V8.75A5.25 5.25 0 0 0 2 3.5H4.75v11.75c0 .14.01.27.04.4.15 1.63 1.5 3.01 3.15 3.15.13.03.26.04.4.04z"/>
    </svg>
);


export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 col-span-2 md:col-span-1">
             <div className="flex items-center gap-2">
                <Video className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Unio</span>
             </div>
            <p className="text-muted-foreground text-sm">
              Reuniones privadas, sin fronteras. Videollamadas simples y seguras.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Facebook className="h-5 w-5"/></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Instagram className="h-5 w-5"/></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><TikTokIcon /></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><MessageCircle className="h-5 w-5"/></Link>
          </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Productos</h4>
            <div className="flex flex-col space-y-2">
              <FooterLink href="#">Reuniones</FooterLink>
              <FooterLink href="#">Chat de Equipo</FooterLink>
              <FooterLink href="#">Pizarra Virtual</FooterLink>
              <FooterLink href="#">Eventos Virtuales</FooterLink>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Recursos</h4>
            <div className="flex flex-col space-y-2">
                <FooterLink href="#">Blog</FooterLink>
                <FooterLink href="#">Centro de Soporte</FooterLink>
                <FooterLink href="#">Tutoriales en Video</FooterLink>
                <FooterLink href="#">Descargar la App</FooterLink>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Empresa</h4>
            <div className="flex flex-col space-y-2">
              <FooterLink href="#">Sobre Nosotros</FooterLink>
              <FooterLink href="#">Contactar a Ventas</FooterLink>
              <FooterLink href="#">Carreras</FooterLink>
              <FooterLink href="#">Prensa</FooterLink>
              <FooterLink href="#">Legal</FooterLink>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Unio, Inc. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <FooterLink href="#">Términos de Servicio</FooterLink>
            <FooterLink href="#">Política de Privacidad</FooterLink>
          </div>
        </div>

      </div>
    </footer>
  );
}
