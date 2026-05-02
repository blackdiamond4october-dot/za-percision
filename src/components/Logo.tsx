import React from 'react';
import { motion } from 'motion/react';
import logoUrl from '../logo.png';

interface LogoProps {
  className?: string;
  glow?: boolean;
}

export default function Logo({ className = "w-10 h-10", glow = false }: LogoProps) {
  return (
    <motion.div 
        className={`${className} relative flex items-center justify-center rounded-xl p-1 overflow-visible`}
        whileHover={{ scale: 1.1 }}
    >
      {/* Background Glow Effect */}
      <motion.div 
          className="absolute inset-[-5px] bg-industrial-orange/40 rounded-full blur-2xl z-0 pointer-events-none"
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
      />
      
      {/* Actual Image Logo */}
      <img 
        src={logoUrl} 
        alt="ZA Precision Logo"
        className="w-full h-full relative z-10 object-contain drop-shadow-[0_0_15px_rgba(239,125,0,0.6)]"
      />
    </motion.div>
  );
}
