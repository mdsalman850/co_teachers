import React from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle, Star, Clock } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub: string;
  index?: number;
  showAnimation?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  label, 
  value, 
  sub, 
  index = 0,
  showAnimation = true 
}) => {
  const { settings } = useSettings();
  const prefersReducedMotion = settings.reducedMotion || 
    (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  
  const shouldAnimate = showAnimation && !prefersReducedMotion;

  const getIcon = () => {
    switch (icon) {
      case 'flame': return <Flame className="w-6 h-6" />;
      case 'check': return <CheckCircle className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      case 'clock': return <Clock className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-6 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
      initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldAnimate ? { 
        duration: 0.5, 
        delay: index * 0.1,
        ease: 'easeOut' 
      } : { duration: 0 }}
    >
      {/* Gradient header tint */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#27AE60]/5 to-transparent rounded-t-2xl" />
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <motion.p 
            className="text-2xl font-bold text-[#0F1724] mb-1"
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={shouldAnimate ? { duration: 0.6, delay: index * 0.1 } : { duration: 0 }}
          >
            {value}
          </motion.p>
          <p className="text-xs text-gray-500">{sub}</p>
        </div>
        <div className="ml-4 p-3 bg-[#27AE60]/10 rounded-xl text-[#27AE60] hover:bg-[#27AE60]/15 transition-colors duration-200">
          {getIcon()}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;