import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  showAnimation?: boolean;
}

const Progress: React.FC<ProgressProps> = ({ 
  value, 
  max = 100, 
  className = '', 
  color = '#27AE60',
  showAnimation = true 
}) => {
  const { settings } = useSettings();
  const percentage = Math.min((value / max) * 100, 100);
  const prefersReducedMotion = settings.reducedMotion || 
    (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  
  const shouldAnimate = showAnimation && !prefersReducedMotion;

  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden group ${className}`}>
      <motion.div
        className="h-full rounded-full relative overflow-hidden group-hover:shadow-sm"
        style={{ backgroundColor: color }}
        initial={shouldAnimate ? { width: 0 } : { width: `${percentage}%` }}
        animate={{ width: `${percentage}%` }}
        transition={shouldAnimate ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`Progress: ${value} out of ${max}`}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-200" />
      </motion.div>
    </div>
  );
};

export default Progress;