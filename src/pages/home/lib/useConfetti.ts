import { useCallback, useState } from 'react';
import { useReducedMotionSetting } from './useReducedMotionSetting';

export const useConfetti = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const reducedMotion = useReducedMotionSetting();

  const burst = useCallback(() => {
    if (reducedMotion || isPlaying) return;

    setIsPlaying(true);
    
    // Create simple particle burst effect
    const particles = Array.from({ length: 15 }, (_, i) => {
      const particle = document.createElement('div');
      particle.className = 'fixed w-2 h-2 bg-[#27AE60] rounded-full pointer-events-none z-50';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.transform = 'translate(-50%, -50%)';
      
      document.body.appendChild(particle);
      
      const angle = (i / 15) * Math.PI * 2;
      const velocity = 100 + Math.random() * 50;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      let x = 0, y = 0, opacity = 1;
      const gravity = 200;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        
        x += vx * 0.016;
        y += vy * 0.016 + gravity * elapsed * 0.016;
        opacity = Math.max(0, 1 - elapsed * 2);
        
        particle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        particle.style.opacity = opacity.toString();
        
        if (opacity > 0 && elapsed < 1.2) {
          requestAnimationFrame(animate);
        } else {
          document.body.removeChild(particle);
        }
      };
      
      requestAnimationFrame(animate);
    });
    
    setTimeout(() => setIsPlaying(false), 1200);
  }, [reducedMotion, isPlaying]);

  return { burst, isPlaying };
};