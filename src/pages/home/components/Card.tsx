import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionSetting } from '../lib/useReducedMotionSetting';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  accent,
  hover = true 
}) => {
  const reducedMotion = useReducedMotionSetting();

  return (
    <motion.div
      className={`rounded-2xl bg-white shadow-lg ring-1 ring-black/5 relative overflow-hidden ${
        hover ? 'hover:shadow-xl transition-shadow duration-300' : ''
      } ${className}`}
      whileHover={!reducedMotion && hover ? { scale: 1.01, y: -2 } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {accent && (
        <div 
          className="absolute top-0 left-0 right-0 h-10 -mx-6 -mt-6 rounded-t-2xl opacity-10"
          style={{ 
            background: `linear-gradient(to right, ${accent}, transparent)` 
          }}
        />
      )}
      {children}
    </motion.div>
  );
};