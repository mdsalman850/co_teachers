import React from 'react';
import { motion } from 'framer-motion';
import { Book, Calculator, Atom, Globe } from 'lucide-react';
import Progress from './Progress';
import { useSettings } from '../contexts/SettingsContext';

interface SubjectCardMiniProps {
  id: string;
  title: string;
  accent: string;
  desc: string;
  progress: number;
  index?: number;
  showAnimation?: boolean;
}

const SubjectCardMini: React.FC<SubjectCardMiniProps> = ({ 
  id, 
  title, 
  accent, 
  desc, 
  progress, 
  index = 0,
  showAnimation = true 
}) => {
  const { settings } = useSettings();
  const prefersReducedMotion = settings.reducedMotion || 
    (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  
  const shouldAnimate = showAnimation && !prefersReducedMotion;

  const getIcon = () => {
    switch (id) {
      case 'eng': return <Book className="w-5 h-5" />;
      case 'math': return <Calculator className="w-5 h-5" />;
      case 'sci': return <Atom className="w-5 h-5" />;
      case 'soc': return <Globe className="w-5 h-5" />;
      default: return <Book className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group"
      initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldAnimate ? { 
        duration: 0.5, 
        delay: index * 0.1,
        ease: 'easeOut' 
      } : { duration: 0 }}
    >
      <div className="flex items-center mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white mr-4 group-hover:scale-105 transition-transform duration-200"
          style={{ backgroundColor: accent }}
        >
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-[#0F1724] text-sm">{title}</h3>
          <p className="text-xs text-gray-600">{desc}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-bold text-gray-700">{progress}%</span>
        </div>
        <Progress value={progress} color={accent} showAnimation={shouldAnimate} />
      </div>

      <button className="w-full text-sm font-medium text-gray-700 hover:text-[#27AE60] hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg py-2">
        Continue
      </button>
    </motion.div>
  );
};

export default SubjectCardMini;