
'use client';

import Link from 'next/link';
import { Video, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { HeaderContent, NavItem as NavItemType } from '@/lib/landing-content';
import { ThemeToggle } from './ThemeToggle';
import { usePWA } from '@/hooks/usePWA';

const NavItem = ({ item }: { item: NavItemType }) => {
  const { canInstall, install } = usePWA();

  const handleInstallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canInstall) {
      install();
    }
  };

  if (item.items && item.items.length > 0) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer transition-colors hover:text-primary">
                    <span>{item.text}</span>
                    <ChevronDown className="h-4 w-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {item.items.map((subItem, index) => {
                  if (subItem.url === '#install-pwa') {
                    if (!canInstall) return null;
                    return (
                       <DropdownMenuItem key={index} asChild>
                          <button onClick={handleInstallClick} className="w-full text-left">
                            {subItem.text}
                          </button>
                        </DropdownMenuItem>
                    )
                  }
                  return (
                    <DropdownMenuItem key={index} asChild>
                        <Link href={subItem.url}>
                            {subItem.text}
                        </Link>
                    </DropdownMenuItem>
                  )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
  }

  if (item.url === '#install-pwa') {
     if (!canInstall) return null;
     return (
        <button onClick={handleInstallClick} className="transition-colors hover:text-primary text-sm font-medium">
          {item.text}
        </button>
     )
  }
  
  return (
    <Link href={item.url || '#'} className="transition-colors hover:text-primary text-sm font-medium">
        {item.text}
    </Link>
  );
};

export default function Header({ content }: { content: HeaderContent | null }) {
  
  if (!content) {
    return (
        <header className="absolute top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex items-center justify-between p-4 text-foreground">
                 <Link href="/" className="flex items-center gap-2">
                    <Video className="h-7 w-7 text-primary" />
                    <span className="text-2xl font-bold">Unio</span>
                </Link>
            </div>
        </header>
    )
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto flex items-center justify-between p-4 text-foreground">
        <Link href="/" className="flex items-center gap-2">
            {content.logo.type === 'image' ? (
                <Image src={content.logo.value} alt="Logo" width={120} height={30} className="h-7 w-auto" />
            ) : (
                <>
                    <Video className="h-7 w-7 text-primary" />
                    <span className="text-2xl font-bold">{content.logo.value}</span>
                </>
            )}
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {content.navItems.map((item, index) => (
              <NavItem key={index} item={item} />
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href={content.ctaSecondary.url}>{content.ctaSecondary.text}</Link>
          </Button>
          <Button asChild>
            <Link href={content.ctaPrimary.url}>{content.ctaPrimary.text}</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
