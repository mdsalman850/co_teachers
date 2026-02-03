import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

const Hero = () => {
  const treeRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!treeRef.current || !cloudsRef.current) return;

      const scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);
      const treeScale = 0.3 + (scrollProgress * 0.7); // Scale from 0.3 to 1
      const treeOpacity = 0.4 + (scrollProgress * 0.6); // Opacity from 0.4 to 1
      
      // Parallax effect for clouds
      const cloudTransform = scrollProgress * 50;
      
      treeRef.current.style.transform = `scale(${treeScale})`;
      treeRef.current.style.opacity = `${treeOpacity}`;
      cloudsRef.current.style.transform = `translateY(${cloudTransform}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background clouds with parallax */}
      <div ref={cloudsRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-20 bg-white/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-48 h-24 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-25 bg-white/25 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-text font-inter leading-tight mb-6">
            Learn. Ask. Grow —<br />
            <span className="text-accent-bio">with a friendly AI tutor.</span>
          </h1>
          
          <p className="text-xl text-gray-600 font-poppins mb-8 leading-relaxed">
            Interactive lessons, podcasts, and AI help that make<br />
            learning simple and fun for students aged 10-16.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="btn-primary text-lg px-8 py-4">
              Sign Up — It's Free
            </button>
            <button className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2">
              <Play size={20} />
              Watch Demo
            </button>
          </div>
        </div>

        {/* Animated Tree */}
        <div className="relative flex items-center justify-center">
          <div 
            ref={treeRef}
            className="tree-animation transition-all duration-300 ease-out"
            style={{ transformOrigin: 'bottom center' }}
          >
            <svg
              width="300"
              height="400"
              viewBox="0 0 300 400"
              className="drop-shadow-lg"
            >
              {/* Tree trunk */}
              <rect x="140" y="300" width="20" height="100" fill="#8B4513" rx="2" />
              
              {/* Tree crown - multiple layers for depth */}
              <ellipse cx="150" cy="280" rx="80" ry="60" fill="#27AE60" opacity="0.8" />
              <ellipse cx="150" cy="260" rx="70" ry="50" fill="#2ECC71" opacity="0.9" />
              <ellipse cx="150" cy="240" rx="60" ry="40" fill="#27AE60" />
              
              {/* Leaves that appear on scroll */}
              <g className="leaves">
                <circle cx="120" cy="250" r="4" fill="#2ECC71" opacity="0.8">
                  <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="0s" />
                </circle>
                <circle cx="180" cy="270" r="3" fill="#27AE60" opacity="0.6">
                  <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" begin="1s" />
                </circle>
                <circle cx="160" cy="230" r="3" fill="#2ECC71" opacity="0.7">
                  <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.5s" />
                </circle>
              </g>
              
              {/* Roots that grow */}
              <path d="M140 400 Q130 410 120 420 M160 400 Q170 410 180 420 M150 400 Q150 415 145 425" 
                    stroke="#8B4513" strokeWidth="3" fill="none" opacity="0.6" />
            </svg>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="particle absolute top-20 left-10 w-2 h-2 bg-accent-bio rounded-full animate-float"></div>
            <div className="particle absolute top-40 right-15 w-1.5 h-1.5 bg-accent-math rounded-full animate-float-delay"></div>
            <div className="particle absolute bottom-30 left-20 w-1 h-1 bg-accent-chem rounded-full animate-float"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;