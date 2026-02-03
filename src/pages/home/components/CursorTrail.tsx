import React, { useEffect, useRef, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const CursorTrail: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const positionRef = useRef<CursorPosition>({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lastParticleTime = useRef<number>(0);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    setIsEnabled(!prefersReducedMotion && !touchDevice);
    setIsTouchDevice(touchDevice);

    if (prefersReducedMotion || touchDevice) return;

    const canvas = trailRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticle = (x: number, y: number, interactive: boolean = false) => {
      const colors = interactive 
        ? ['#27AE60', '#FF6B6B', '#22C1C3', '#F59E0B', '#6C5CE7']
        : ['#27AE60', '#27AE6080', '#27AE6040'];
      
      return {
        id: Date.now() + Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * (interactive ? 4 : 2),
        vy: (Math.random() - 0.5) * (interactive ? 4 : 2),
        life: interactive ? 60 : 30,
        maxLife: interactive ? 60 : 30,
        size: Math.random() * (interactive ? 4 : 2) + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    };

    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        return particle.life > 0;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const updateCursor = () => {
      if (cursorRef.current) {
        const scale = isOverInteractive ? 1.8 : 1;
        const opacity = isOverInteractive ? 0.8 : 0.6;
        
        cursorRef.current.style.transform = `translate(${positionRef.current.x - 15}px, ${positionRef.current.y - 15}px) scale(${scale})`;
        cursorRef.current.style.opacity = opacity.toString();
      }

      // Create particles
      const now = Date.now();
      if (now - lastParticleTime.current > (isOverInteractive ? 50 : 100)) {
        particlesRef.current.push(
          createParticle(positionRef.current.x, positionRef.current.y, isOverInteractive)
        );
        lastParticleTime.current = now;
      }

      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"], .subject-card, input, textarea')) {
        setIsOverInteractive(true);
        
        // Create burst of particles on interactive element hover
        for (let i = 0; i < 8; i++) {
          setTimeout(() => {
            particlesRef.current.push(
              createParticle(
                positionRef.current.x + (Math.random() - 0.5) * 20,
                positionRef.current.y + (Math.random() - 0.5) * 20,
                true
              )
            );
          }, i * 20);
        }
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"], .subject-card, input, textarea')) {
        setIsOverInteractive(false);
      }
    };

    const handleClick = () => {
      if (isOverInteractive) {
        // Create explosion effect on click
        for (let i = 0; i < 15; i++) {
          particlesRef.current.push(
            createParticle(
              positionRef.current.x + (Math.random() - 0.5) * 30,
              positionRef.current.y + (Math.random() - 0.5) * 30,
              true
            )
          );
        }
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    
    // Add hover effects to interactive elements
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    updateCursor();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOverInteractive]);

  if (!isEnabled || isTouchDevice) return null;

  return (
    <>
      {/* Main cursor trail */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 opacity-0 transition-all duration-200 ease-out"
        style={{
          background: isOverInteractive 
            ? 'radial-gradient(circle, rgba(39, 174, 96, 0.6) 0%, rgba(39, 174, 96, 0.3) 40%, rgba(255, 107, 107, 0.2) 70%, transparent 100%)'
            : 'radial-gradient(circle, rgba(39, 174, 96, 0.4) 0%, rgba(39, 174, 96, 0.2) 50%, transparent 70%)',
          boxShadow: isOverInteractive 
            ? '0 0 30px rgba(39, 174, 96, 0.5), 0 0 60px rgba(39, 174, 96, 0.3)'
            : '0 0 20px rgba(39, 174, 96, 0.3)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Particle canvas */}
      <canvas
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-40"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Cursor ring effect */}
      <div
        className="fixed top-0 left-0 w-12 h-12 border-2 border-[#27AE60] rounded-full pointer-events-none z-45 opacity-0 transition-all duration-300 ease-out"
        style={{
          transform: `translate(${positionRef.current.x - 24}px, ${positionRef.current.y - 24}px) scale(${isOverInteractive ? 1.5 : 1})`,
          opacity: isOverInteractive ? 0.6 : 0.3,
          borderColor: isOverInteractive ? '#FF6B6B' : '#27AE60',
        }}
      />
    </>
  );
};

export default CursorTrail;