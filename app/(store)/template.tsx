'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="pt-24 min-h-screen flex flex-col"
    >
      {children}
    </motion.main>
  );
}
