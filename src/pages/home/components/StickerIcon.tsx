import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionSetting } from '../lib/useReducedMotionSetting';

interface StickerIconProps {
  icon: React.ReactNode;
  accent?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StickerIcon: React.FC<StickerIconProps> = ({ 
  icon, 
  accent = '#27AE60', 
  size = 'md',
  className = '' 
}) => {
  const reducedMotion = useReducedMotionSetting();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center text-white shadow-lg ${className}`}
      style={{ backgroundColor: accent }}
      whileHover={!reducedMotion ? { 
        rotate: [-2, 2, -1, 0],
        scale: 1.05
      } : {}}
      transition={{ 
        duration: 0.4, 
        ease: 'easeInOut',
        rotate: { repeat: 1, repeatType: 'reverse' }
      }}
    >
      {icon}
    </motion.div>
  );
};