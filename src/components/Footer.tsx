'use client';

import Link from 'next/link';
import { Video, Twitter, Linkedin, Facebook } from 'lucide-react';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
    {children}
  </Link>
);

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
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
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <div className="flex flex-col space-y-2">
              <FooterLink href="#">Términos de Servicio</FooterLink>
              <FooterLink href="#">Política de Privacidad</FooterLink>
              <FooterLink href="#">Uso Aceptable</FooterLink>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Unio</span>
          </div>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            © {new Date().getFullYear()} Unio, Inc. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Twitter className="h-5 w-5"/></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Linkedin className="h-5 w-5"/></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Facebook className="h-5 w-5"/></Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
