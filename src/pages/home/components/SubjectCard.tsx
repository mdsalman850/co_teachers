import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Star, Heart } from 'lucide-react';

interface SubjectCardProps {
  subject: {
    id: string;
    title: string;
    accent: string;
    description: string;
    progress: number;
    icon: string;
  };
  index: number;
  isVisible: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, index, isVisible }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShouldAnimate(!prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (isHovered && shouldAnimate) {
      const interval = setInterval(() => {
        const newParticle = {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100
        };
        setParticles(prev => [...prev.slice(-5), newParticle]);
      }, 200);

      return () => clearInterval(interval);
    } else {
      setParticles([]);
    }
  }, [isHovered, shouldAnimate]);

  const cardStyle = {
    backgroundColor: 'white',
    borderTopColor: `var(${subject.accent})`,
    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
    opacity: isVisible ? 1 : 0,
    transitionDelay: `${index * 150}ms`,
  };

  const progressStyle = {
    width: isVisible ? `${subject.progress}%` : '0%',
    backgroundColor: `var(${subject.accent})`,
  };

  const getSubjectVisualWorld = () => {
    switch (subject.id) {
      case 'mathematics':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Mathematical Grid Background */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                  <pattern id="mathGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#FF6B6B" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mathGrid)" />
              </svg>
            </div>
            
            {/* 3D Geometric Shapes */}
            <div className={`absolute top-4 right-4 w-12 h-12 ${isHovered && shouldAnimate ? 'animate-spin' : ''} transition-all duration-2000`}>
              <div className="relative w-full h-full">
                {/* Cube */}
                <div className="absolute inset-0 border-2 border-[#FF6B6B] bg-gradient-to-br from-[#FF6B6B]20 to-[#FF6B6B]40 transform rotate-12 rounded-lg shadow-lg"></div>
                <div className="absolute top-1 left-1 w-8 h-8 border-2 border-[#FF6B6B] bg-gradient-to-br from-[#FF6B6B]30 to-[#FF6B6B]50 transform -rotate-12 rounded-lg"></div>
              </div>
            </div>

            {/* Floating Numbers */}
            <div className={`absolute top-6 left-4 text-2xl font-bold text-[#FF6B6B] ${isHovered && shouldAnimate ? 'animate-bounce' : ''} transition-all duration-500`}>π</div>
            <div className={`absolute bottom-8 right-6 text-lg font-bold text-[#FF6B6B] ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-700`}>∑</div>
            <div className={`absolute top-1/2 left-6 text-xl font-bold text-[#FF6B6B] ${isHovered && shouldAnimate ? 'animate-bounce' : ''} transition-all duration-600`}>∞</div>

            {/* Geometric Patterns */}
            <div className="absolute bottom-4 left-4">
              <div className={`w-8 h-8 ${isHovered && shouldAnimate ? 'animate-spin' : ''} transition-all duration-1000`}>
                <div className="absolute inset-0 border-2 border-[#FF6B6B] transform rotate-45"></div>
                <div className="absolute inset-1 border-2 border-[#FF6B6B] rounded-full"></div>
                <div className="absolute inset-2 bg-[#FF6B6B] transform rotate-45"></div>
              </div>
            </div>

            {/* Mathematical Formulas */}
            <div className={`absolute top-1/3 right-8 text-sm font-mono text-[#FF6B6B] ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-400`}>
              x² + y² = r²
            </div>
          </div>
        );
      
      case 'science':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Laboratory Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#27AE60]05 to-[#27AE60]15 rounded-2xl"></div>
            
            {/* Molecular Structure */}
            <div className="absolute top-4 right-4 w-16 h-16">
              <div className={`relative w-full h-full ${isHovered && shouldAnimate ? 'animate-spin' : ''} transition-all duration-3000`}>
                {/* Central Atom */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#27AE60] rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
                
                {/* Electron Orbits */}
                <div className="absolute inset-0 border border-[#27AE60] rounded-full opacity-60"></div>
                <div className="absolute inset-2 border border-[#27AE60] rounded-full opacity-40 transform rotate-45"></div>
                
                {/* Electrons */}
                <div className={`absolute top-0 left-1/2 w-2 h-2 bg-[#27AE60] rounded-full transform -translate-x-1/2 ${isHovered && shouldAnimate ? 'animate-ping' : ''}`}></div>
                <div className={`absolute bottom-0 right-1/2 w-2 h-2 bg-[#27AE60] rounded-full transform translate-x-1/2 ${isHovered && shouldAnimate ? 'animate-ping' : ''}`} style={{animationDelay: '0.5s'}}></div>
                <div className={`absolute top-1/2 right-0 w-2 h-2 bg-[#27AE60] rounded-full transform -translate-y-1/2 ${isHovered && shouldAnimate ? 'animate-ping' : ''}`} style={{animationDelay: '1s'}}></div>
              </div>
            </div>

            {/* DNA Helix */}
            <div className="absolute bottom-4 left-4 w-6 h-16">
              <div className={`relative w-full h-full ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-1000`}>
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#27AE60] to-[#27AE60]60 rounded-full transform rotate-12"></div>
                <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-[#27AE60]60 to-[#27AE60] rounded-full transform -rotate-12"></div>
                {/* DNA Base Pairs */}
                <div className="absolute top-2 left-1 right-1 h-px bg-[#27AE60]"></div>
                <div className="absolute top-6 left-1 right-1 h-px bg-[#27AE60]"></div>
                <div className="absolute top-10 left-1 right-1 h-px bg-[#27AE60]"></div>
                <div className="absolute top-14 left-1 right-1 h-px bg-[#27AE60]"></div>
              </div>
            </div>

            {/* Chemical Formulas */}
            <div className={`absolute top-8 left-6 text-sm font-mono text-[#27AE60] ${isHovered && shouldAnimate ? 'animate-bounce' : ''} transition-all duration-600`}>
              H₂O
            </div>
            <div className={`absolute bottom-12 right-8 text-sm font-mono text-[#27AE60] ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-800`}>
              CO₂
            </div>

            {/* Microscope Elements */}
            <div className="absolute top-1/2 left-8">
              <div className={`w-3 h-6 bg-[#27AE60] rounded-full ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-500`}></div>
              <div className="absolute -bottom-1 left-1/2 w-1 h-3 bg-[#27AE60] transform -translate-x-1/2"></div>
            </div>

            {/* Bubbling Effect */}
            {isHovered && shouldAnimate && (
              <>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#27AE60] rounded-full animate-ping opacity-60"></div>
                <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-[#27AE60] rounded-full animate-ping opacity-40" style={{animationDelay: '0.3s'}}></div>
                <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-[#27AE60] rounded-full animate-ping opacity-50" style={{animationDelay: '0.6s'}}></div>
              </>
            )}
          </div>
        );
      
      case 'english':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Library/Book Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#22C1C3]05 to-[#22C1C3]15 rounded-2xl"></div>
            
            {/* Floating Books */}
            <div className="absolute top-4 right-4">
              <div className={`relative ${isHovered && shouldAnimate ? 'animate-float' : ''} transition-all duration-1000`}>
                <div className="w-8 h-10 bg-gradient-to-b from-[#22C1C3] to-[#22C1C3]80 rounded-sm shadow-lg transform rotate-12"></div>
                <div className="absolute top-1 left-1 w-6 h-8 bg-gradient-to-b from-[#22C1C3]60 to-[#22C1C3]40 rounded-sm transform -rotate-6"></div>
                <div className="absolute top-2 left-2 w-4 h-6 bg-white rounded-sm opacity-80"></div>
                {/* Book Lines */}
                <div className="absolute top-3 left-2.5 w-3 h-px bg-[#22C1C3] opacity-60"></div>
                <div className="absolute top-4 left-2.5 w-2.5 h-px bg-[#22C1C3] opacity-60"></div>
                <div className="absolute top-5 left-2.5 w-3 h-px bg-[#22C1C3] opacity-60"></div>
              </div>
            </div>

            {/* Animated Letters */}
            <div className={`absolute top-6 left-4 text-3xl font-serif text-[#22C1C3] ${isHovered && shouldAnimate ? 'animate-bounce' : ''} transition-all duration-500`}>
              A
            </div>
            <div className={`absolute bottom-8 left-6 text-2xl font-serif text-[#22C1C3] ${isHovered && shouldAnimate ? 'animate-bounce' : ''} transition-all duration-700`} style={{animationDelay: '0.2s'}}>
              B
            </div>
            <div className={`absolute top-1/2 right-6 text-2xl font-serif text-[#22C1C3] ${isHovered && shouldAnimate ? 'animate-bounce' : ''} transition-all duration-600`} style={{animationDelay: '0.4s'}}>
              C
            </div>

            {/* Quill Pen */}
            <div className="absolute bottom-4 right-4">
              <div className={`relative ${isHovered && shouldAnimate ? 'animate-wiggle' : ''} transition-all duration-500`}>
                <div className="w-1 h-8 bg-gradient-to-t from-[#22C1C3] to-[#22C1C3]60 rounded-full transform rotate-45"></div>
                <div className="absolute -top-1 -left-1 w-3 h-3 border-2 border-[#22C1C3] rounded-full bg-white"></div>
                {/* Ink Drop */}
                <div className={`absolute -bottom-1 left-0 w-1 h-1 bg-[#22C1C3] rounded-full ${isHovered && shouldAnimate ? 'animate-ping' : ''}`}></div>
              </div>
            </div>

            {/* Poetry Lines */}
            <div className="absolute top-1/3 left-6 right-6">
              <div className={`h-px bg-[#22C1C3] opacity-30 ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-400`}></div>
              <div className={`mt-2 h-px bg-[#22C1C3] opacity-20 w-3/4 ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-600`} style={{animationDelay: '0.2s'}}></div>
              <div className={`mt-2 h-px bg-[#22C1C3] opacity-25 w-5/6 ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-500`} style={{animationDelay: '0.4s'}}></div>
            </div>

            {/* Quotation Marks */}
            <div className={`absolute top-8 left-8 text-4xl font-serif text-[#22C1C3] opacity-40 ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-300`}>
              "
            </div>
            <div className={`absolute bottom-16 right-8 text-4xl font-serif text-[#22C1C3] opacity-40 ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-300`} style={{animationDelay: '0.5s'}}>
              "
            </div>

            {/* Word Bubbles */}
            {isHovered && shouldAnimate && (
              <>
                <div className="absolute top-1/4 right-1/3 px-2 py-1 bg-[#22C1C3]20 rounded-full text-xs text-[#22C1C3] animate-float">read</div>
                <div className="absolute top-2/3 left-1/4 px-2 py-1 bg-[#22C1C3]20 rounded-full text-xs text-[#22C1C3] animate-float" style={{animationDelay: '0.3s'}}>write</div>
              </>
            )}
          </div>
        );
      
      case 'social-studies':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* World Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]05 to-[#F59E0B]15 rounded-2xl"></div>
            
            {/* Globe */}
            <div className="absolute top-4 right-4 w-12 h-12">
              <div className={`relative w-full h-full ${isHovered && shouldAnimate ? 'animate-spin' : ''} transition-all duration-4000`}>
                <div className="absolute inset-0 border-2 border-[#F59E0B] rounded-full bg-gradient-to-br from-[#F59E0B]20 to-[#F59E0B]40"></div>
                {/* Continents */}
                <div className="absolute top-2 left-2 w-3 h-2 bg-[#F59E0B] rounded-sm opacity-60"></div>
                <div className="absolute top-4 right-2 w-2 h-3 bg-[#F59E0B] rounded-sm opacity-60"></div>
                <div className="absolute bottom-3 left-3 w-2 h-2 bg-[#F59E0B] rounded-sm opacity-60"></div>
                {/* Latitude/Longitude Lines */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-[#F59E0B] opacity-40"></div>
                <div className="absolute top-0 left-1/2 w-px h-full bg-[#F59E0B] opacity-40"></div>
                <div className="absolute inset-1 border border-[#F59E0B] rounded-full opacity-30"></div>
              </div>
            </div>

            {/* Historical Timeline */}
            <div className="absolute bottom-4 left-4 w-16 h-8">
              <div className="relative w-full h-full">
                <div className="absolute bottom-0 left-0 w-full h-px bg-[#F59E0B]"></div>
                {/* Timeline Events */}
                <div className={`absolute bottom-0 left-2 w-1 h-6 bg-[#F59E0B] ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-400`}></div>
                <div className={`absolute bottom-0 left-6 w-1 h-4 bg-[#F59E0B] ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-600`} style={{animationDelay: '0.2s'}}></div>
                <div className={`absolute bottom-0 left-10 w-1 h-8 bg-[#F59E0B] ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-500`} style={{animationDelay: '0.4s'}}></div>
                <div className={`absolute bottom-0 right-2 w-1 h-3 bg-[#F59E0B] ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-700`} style={{animationDelay: '0.6s'}}></div>
              </div>
            </div>

            {/* Ancient Monuments */}
            <div className="absolute top-1/3 left-6">
              <div className={`relative ${isHovered && shouldAnimate ? 'animate-bounce' : ''} transition-all duration-800`}>
                {/* Pyramid */}
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-[#F59E0B]"></div>
                <div className="absolute -top-1 left-1 w-0 h-0 border-l-2 border-r-2 border-b-3 border-l-transparent border-r-transparent border-b-[#F59E0B] opacity-60"></div>
              </div>
            </div>

            {/* Map Pins */}
            <div className={`absolute top-8 right-8 w-2 h-3 bg-[#F59E0B] rounded-t-full ${isHovered && shouldAnimate ? 'animate-bounce' : ''} transition-all duration-500`}>
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2"></div>
            </div>
            <div className={`absolute top-1/2 left-8 w-1.5 h-2 bg-[#F59E0B] rounded-t-full ${isHovered && shouldAnimate ? 'animate-bounce' : ''} transition-all duration-700`} style={{animationDelay: '0.3s'}}>
              <div className="absolute top-0 left-1/2 w-0.5 h-0.5 bg-white rounded-full transform -translate-x-1/2"></div>
            </div>

            {/* Cultural Symbols */}
            <div className={`absolute bottom-8 right-6 text-lg text-[#F59E0B] ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-600`}>
              🏛️
            </div>
            <div className={`absolute top-1/2 right-1/3 text-sm text-[#F59E0B] ${isHovered && shouldAnimate ? 'animate-pulse' : ''} transition-all duration-800`} style={{animationDelay: '0.4s'}}>
              🗿
            </div>

            {/* Compass */}
            <div className="absolute bottom-12 right-12 w-6 h-6">
              <div className={`relative w-full h-full ${isHovered && shouldAnimate ? 'animate-spin' : ''} transition-all duration-2000`}>
                <div className="absolute inset-0 border border-[#F59E0B] rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-px bg-[#F59E0B] transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-px h-4 bg-[#F59E0B] transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-[#F59E0B] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            {/* Historical Dates */}
            {isHovered && shouldAnimate && (
              <>
                <div className="absolute top-1/4 left-1/3 text-xs font-mono text-[#F59E0B] animate-fade-in">1776</div>
                <div className="absolute top-2/3 right-1/4 text-xs font-mono text-[#F59E0B] animate-fade-in" style={{animationDelay: '0.5s'}}>1969</div>
              </>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative bg-white rounded-2xl shadow-lg border-t-4 p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 overflow-hidden ${
        shouldAnimate ? 'transition-all duration-500 ease-out' : ''
      }`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (subject.id === 'social-studies') {
          navigate('/social-studies');
          return;
        }
        if (subject.id === 'science') {
          navigate('/science');
          return;
        }
        if (subject.id === 'mathematics') {
          navigate('/math');
          return;
        }
        console.log(`Navigate to ${subject.id}`);
      }}
    >
      {/* Animated particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full animate-ping pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: `var(${subject.accent})`,
            animationDuration: '1s',
          }}
        />
      ))}

      {/* Subject-specific immersive world */}
      {getSubjectVisualWorld()}

      {/* Hover glow effect */}
      <div 
        className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
          isHovered ? 'bg-gradient-to-br from-transparent via-transparent to-opacity-5' : ''
        }`}
        style={{
          background: isHovered ? `linear-gradient(135deg, transparent 0%, var(${subject.accent})10 100%)` : 'transparent'
        }}
      />

      {/* Subject Title with enhanced styling */}
      <h3 className={`text-xl font-bold text-center mb-3 text-[#0F1724] tracking-wide transition-all duration-300 relative z-10 ${
        isHovered ? 'scale-105' : 'scale-100'
      }`}>
        {subject.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed relative z-10">
        {subject.description}
      </p>

      {/* Enhanced Progress Bar */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-gray-500 font-medium">Progress</span>
          <span className="text-xs font-bold text-gray-700">{subject.progress}%</span>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
            style={progressStyle}
          >
            {/* Progress bar shine effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 ${
              isHovered && shouldAnimate ? 'animate-pulse' : ''
            }`} />
          </div>
          {/* Progress indicator dot */}
          <div 
            className={`absolute top-1/2 w-2 h-2 rounded-full border-2 border-white transform -translate-y-1/2 transition-all duration-1000 ease-out ${
              isHovered && shouldAnimate ? 'scale-125' : 'scale-100'
            }`}
            style={{
              left: `${subject.progress}%`,
              backgroundColor: `var(${subject.accent})`,
              transform: `translateX(-50%) translateY(-50%) ${isHovered && shouldAnimate ? 'scale(1.25)' : 'scale(1)'}`
            }}
          />
        </div>
      </div>

      {/* Enhanced Continue Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          if (subject.id === 'social-studies') {
            navigate('/social-studies');
            return;
          }
          if (subject.id === 'science') {
            navigate('/science');
            return;
          }
          if (subject.id === 'mathematics') {
            navigate('/math');
            return;
          }
          console.log(`Navigate to ${subject.id}`);
        }}
        className={`relative w-full py-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center group overflow-hidden z-10 ${
          isHovered 
            ? 'text-white shadow-lg transform scale-105' 
            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
        }`}
        style={{
          background: isHovered ? `linear-gradient(135deg, var(${subject.accent}), var(${subject.accent})dd)` : undefined,
          boxShadow: isHovered ? `0 8px 25px var(${subject.accent})40` : undefined,
        }}
      >
        {/* Button background animation */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 transition-all duration-700 ${
            isHovered ? 'translate-x-full' : '-translate-x-full'
          }`}
        />
        
        <Play className={`w-5 h-5 mr-3 transition-all duration-300 ${
          isHovered ? 'translate-x-1 scale-110' : 'translate-x-0 scale-100'
        }`} />
        <span className="relative z-10">Continue Learning</span>
        
        {/* Button heart effect for engagement */}
        {isHovered && shouldAnimate && (
          <Heart className="absolute right-4 w-4 h-4 text-red-300 animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default SubjectCard;