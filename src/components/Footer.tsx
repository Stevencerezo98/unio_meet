
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Video, Facebook, Instagram } from 'lucide-react';
import type { FooterContent } from '@/lib/landing-content';
import { usePWA } from '@/hooks/usePWA';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const { canInstall, install } = usePWA();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href === '#install-pwa' && canInstall) {
      e.preventDefault();
      install();
    }
  };
  
  return (
    <Link href={href} onClick={handleClick} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
        {children}
    </Link>
  );
};


const SocialIcon = ({ iconName, href }: { iconName: string; href: string }) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Facebook: Facebook,
    Instagram: Instagram,
    TikTok: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12.52.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.65 4.31 1.7.03 1.31-.01 2.61-.02 3.91-.19.01-.38.02-.57.02-1.55.01-3.1-.48-4.36-1.5-1.25-1.02-1.95-2.5-1.95-4.04 0-.19.01-.38.02-.57z"/>
        <path d="M10 15.25a5.25 5.25 0 0 0 5.25 5.25V23a8 8 0 0 1-8-8V8.75A5.25 5.25 0 0 0 2 3.5H4.75v11.75c0 .14.01.27.04.4.15 1.63 1.5 3.01 3.15 3.15.13.03.26.04.4.04z"/>
      </svg>
    ),
    WhatsApp: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
    )
  };

  const IconComponent = iconMap[iconName];

  if (!IconComponent) return null;

  return (
    <Link href={href} className="text-muted-foreground hover:text-foreground">
      <IconComponent />
    </Link>
  );
};


export default function Footer({ content }: { content: FooterContent | null }) {
  if (!content) {
    return <footer className="border-t border-border bg-background/50" />;
  }

  return (
    <footer className="border-t border-border bg-background/50">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          <div className="space-y-3 col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Video className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">{content.brandName}</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              {content.brandDescription}
            </p>
            <div className="flex items-center gap-4 pt-2">
              {content.socialLinks.map((social) => (
                <SocialIcon key={social.name} iconName={social.name} href={social.url} />
              ))}
            </div>
          </div>

          {content.linkColumns.map((column, index) => (
             <div key={index} className="space-y-3 col-span-1">
              <h4 className="font-semibold text-foreground">{column.title}</h4>
              <div className="flex flex-col space-y-2">
                {column.links.map((link, linkIndex) => (
                  <FooterLink key={linkIndex} href={link.url}>{link.text}</FooterLink>
                ))}
              </div>
            </div>
          ))}

        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            {content.copyright.replace('{year}', new Date().getFullYear().toString())}
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            {content.legalLinks.map((link, index) => (
              <FooterLink key={index} href={link.url}>{link.text}</FooterLink>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
