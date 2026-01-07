
'use client';

import { usePWA } from '@/hooks/usePWA';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function InstallPWAButton() {
  const { canInstall, install } = usePWA();

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Button
            onClick={install}
            className="rounded-full bg-black/30 backdrop-blur-md p-4 h-14 border border-neutral-700/50 shadow-2xl text-white hover:bg-black/60"
          >
            <Download className="mr-2 h-5 w-5" />
            Instalar App Unio
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
