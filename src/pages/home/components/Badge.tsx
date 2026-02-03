import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Heart } from 'lucide-react';

interface BadgeProps {
  name: string;
  caption: string;
  index?: number;
  showAnimation?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  name, 
  caption, 
  index = 0,
  showAnimation = true 
}) => {
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const shouldAnimate = showAnimation && !prefersReducedMotion;

  const getIcon = () => {
    if (name.includes('Streak')) return <Award className="w-5 h-5" />;
    if (name.includes('Quiz')) return <Star className="w-5 h-5" />;
    if (name.includes('Explorer')) return <Trophy className="w-5 h-5" />;
    return <Heart className="w-5 h-5" />;
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-4 text-center"
      initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={shouldAnimate ? { 
        duration: 0.4, 
        delay: index * 0.1,
        ease: 'easeOut' 
      } : { duration: 0 }}
    >
      <div className="w-12 h-12 bg-[#27AE60]/10 rounded-xl flex items-center justify-center text-[#27AE60] mx-auto mb-3">
        {getIcon()}
      </div>
      <h4 className="font-bold text-[#0F1724] text-sm mb-1">{name}</h4>
      <p className="text-xs text-gray-600">{caption}</p>
    </motion.div>
  );
};

export default Badge;