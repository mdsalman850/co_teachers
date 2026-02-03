import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotionSetting } from '../lib/useReducedMotionSetting';

interface SparkleProps {
  trigger: boolean;
  children: React.ReactNode;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

export const Sparkles: React.FC<SparkleProps> = ({ trigger, children }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const reducedMotion = useReducedMotionSetting();

  useEffect(() => {
    if (!trigger || reducedMotion) return;

    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 50,
    }));

    setSparkles(newSparkles);

    const timer = setTimeout(() => {
      setSparkles([]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [trigger, reducedMotion]);

  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-[#27AE60] rounded-full pointer-events-none"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
              rotate: [0, 180, 360]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: sparkle.delay / 1000,
              ease: 'easeOut'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};