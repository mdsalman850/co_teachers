import React, { useEffect, useState } from 'react';
import { useReducedMotionSetting } from './useReducedMotionSetting';

interface CountUpProps {
  end: number;
  duration?: number;
  className?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  duration = 700, 
  className = '',
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);
  const reducedMotion = useReducedMotionSetting();

  useEffect(() => {
    if (reducedMotion) {
      setCount(end);
      return;
    }

    let startTime: number;
    const startValue = 0;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(startValue + (end - startValue) * easeOut);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, reducedMotion]);

  return <span className={className}>{count}{suffix}</span>;
};