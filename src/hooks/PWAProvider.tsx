
'use client';

import { useState, useEffect, useCallback } from 'react';
import { PWAContext, type PWAContextType, type BeforeInstallPromptEvent } from './usePWA';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const checkStandalone = () => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsStandalone(true);
        } else {
            setIsStandalone(false);
        }
    };
    
    // Check on mount
    checkStandalone();
    
    // Listen for changes
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mediaQuery.removeEventListener('change', checkStandalone);
    };
  }, []);

  const install = useCallback(async () => {
    if (!installPrompt) {
      return;
    }
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  const value: PWAContextType = {
    canInstall: !!installPrompt && !isStandalone,
    install,
    isStandalone,
  };

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
}
