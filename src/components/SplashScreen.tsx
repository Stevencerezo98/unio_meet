
'use client';

import { motion } from 'framer-motion';
import { Video } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a] z-[100]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex items-center gap-4"
      >
        <Video className="h-16 w-16 text-primary" />
        <span className="text-6xl font-bold text-white">Unio</span>
      </motion.div>
    </div>
  );
}
