
'use client';

import { useContext, createContext } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAContextType {
  canInstall: boolean;
  install: () => Promise<void>;
}

export const PWAContext = createContext<PWAContextType | null>(null);

export function usePWA() {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}
