import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionSetting } from '../lib/useReducedMotionSetting';

interface GoalRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  onClick?: () => void;
}

export const GoalRing: React.FC<GoalRingProps> = ({ 
  progress, 
  size = 48, 
  strokeWidth = 4,
  label = 'Daily Goal',
  onClick 
}) => {
  const reducedMotion = useReducedMotionSetting();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2 rounded-lg p-1"
      aria-label={`${label}: ${progress}%`}
    >
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E8F3ED"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#27AE60"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: reducedMotion ? strokeDashoffset : circumference }}
            transition={!reducedMotion ? { 
              duration: 1, 
              delay: 0.5, 
              ease: 'easeOut' 
            } : { duration: 0 }}
            onAnimationComplete={() => {
              if (!reducedMotion) {
                // Small bounce effect
                const circle = document.querySelector('circle[stroke="#27AE60"]') as SVGCircleElement;
                if (circle) {
                  circle.style.transform = 'scale(1.1)';
                  setTimeout(() => {
                    circle.style.transform = 'scale(1)';
                  }, 150);
                }
              }
            }}
            style={{ strokeDashoffset }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-[#27AE60]">{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="text-left">
        <div className="text-sm font-medium text-[#0F1724]">{label}</div>
        <div className="text-xs text-gray-500">{Math.round(progress)}% complete</div>
      </div>
    </button>
  );
};