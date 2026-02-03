import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, RotateCcw } from 'lucide-react';
import { useReducedMotionSetting } from '../lib/useReducedMotionSetting';

interface FlipCardProps {
  id: string;
  title: string;
  accent: string;
  desc: string;
  progress: number;
  index?: number;
}

export const FlipCard: React.FC<FlipCardProps> = ({ 
  id, 
  title, 
  accent, 
  desc, 
  progress, 
  index = 0 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const reducedMotion = useReducedMotionSetting();

  const handleFlip = () => setIsFlipped(!isFlipped);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  const getSubjectDoodle = () => {
    const doodleStyle = {
      transform: !reducedMotion ? 'rotate(8deg)' : 'none',
      transition: 'transform 0.3s ease'
    };

    switch (id) {
      case 'eng':
        return (
          <div style={doodleStyle} className="text-2xl opacity-60">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 6h16v20H8z" stroke={accent} strokeWidth="2" fill={`${accent}20`}/>
              <path d="M12 12h8M12 16h6M12 20h8" stroke={accent} strokeWidth="1.5"/>
            </svg>
          </div>
        );
      case 'math':
        return (
          <div style={doodleStyle} className="text-2xl opacity-60">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="8" stroke={accent} strokeWidth="2" fill={`${accent}20`}/>
              <path d="M12 12l8 8M20 12l-8 8" stroke={accent} strokeWidth="2"/>
            </svg>
          </div>
        );
      case 'sci':
        return (
          <div style={doodleStyle} className="text-2xl opacity-60">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="3" fill={accent}/>
              <circle cx="16" cy="8" r="2" fill={`${accent}80`}/>
              <circle cx="24" cy="20" r="2" fill={`${accent}80`}/>
              <circle cx="8" cy="20" r="2" fill={`${accent}80`}/>
              <path d="M16 13v6M19 16h6M13 16H7" stroke={accent} strokeWidth="1"/>
            </svg>
          </div>
        );
      case 'soc':
        return (
          <div style={doodleStyle} className="text-2xl opacity-60">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="10" stroke={accent} strokeWidth="2" fill={`${accent}20`}/>
              <path d="M6 16h20M16 6v20" stroke={accent} strokeWidth="1"/>
              <path d="M10 10h12v12H10z" stroke={accent} strokeWidth="1" fill={`${accent}10`}/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="relative w-full h-48 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 rounded-2xl"
      style={{ perspective: '1000px' }}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${title} card. Press Enter to flip and see quick actions.`}
      initial={!reducedMotion ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={!reducedMotion ? { 
        duration: 0.5, 
        delay: index * 0.1,
        ease: 'easeOut' 
      } : { duration: 0 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={!reducedMotion ? { rotateY: isFlipped ? 180 : 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-6 h-full relative overflow-hidden">
            {/* Accent header */}
            <div 
              className="absolute top-0 left-0 right-0 h-3 rounded-t-2xl"
              style={{ backgroundColor: accent }}
            />
            
            {/* Content */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: accent }}
                >
                  {title.charAt(0)}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#0F1724]">{progress}%</div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
              </div>
              
              <h3 className="font-bold text-[#0F1724] text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-600 mb-4">{desc}</p>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: accent }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={!reducedMotion ? { duration: 1, delay: index * 0.1 + 0.3 } : { duration: 0 }}
                />
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Click to see quick actions →
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-6 h-full relative overflow-hidden">
            {/* Accent header */}
            <div 
              className="absolute top-0 left-0 right-0 h-3 rounded-t-2xl"
              style={{ backgroundColor: accent }}
            />
            
            {/* Back content */}
            <div className="pt-2 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#0F1724] text-lg">{title}</h3>
                {getSubjectDoodle()}
              </div>
              
              <div className="flex-1 flex flex-col space-y-3">
                <button 
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2"
                  style={{ backgroundColor: `${accent}10` }}
                >
                  <Play className="w-5 h-5" style={{ color: accent }} />
                  <span className="font-medium text-[#0F1724]">Resume Lesson</span>
                </button>
                
                <button className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2">
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-[#0F1724]">Practice</span>
                </button>
                
                <button className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-[#0F1724]">Review Notes</span>
                </button>
              </div>
              
              <div className="text-xs text-gray-500 text-center mt-4">
                ← Click to flip back
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};