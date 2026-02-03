'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Crown, Sparkles, Maximize, Minimize, Calendar } from 'lucide-react';
import { mughalEmperors as emperors } from '../data';

interface MughalSimulatorProps {
  className?: string;
}

export default function MughalSimulator({ className = '' }: MughalSimulatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isNarrating, setIsNarrating] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentEmperor = emperors[currentIndex];

  // Check for speech synthesis support
  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
  }, []);

  // Fullscreen functionality
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 8000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % emperors.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + emperors.length) % emperors.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handleTimelineClick = (index: number) => {
    if (index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleNarration = useCallback(() => {
    if (!speechSupported) return;

    if (isNarrating) {
      speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    const text = `${currentEmperor.name}. ${currentEmperor.summary.join(' ')} Fun fact: ${currentEmperor.funFact}`;
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsNarrating(true);
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [currentEmperor, isNarrating, speechSupported]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen w-full bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 text-center py-3 px-4 border-b border-emerald-700/30">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Crown className="text-amber-400 w-6 h-6" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
            Mughal Emperors
          </h1>
          <Sparkles className="text-emerald-400 w-6 h-6" />
        </div>
        <p className="text-emerald-300/70 text-sm">Interactive Historical Journey • Chapter 3</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="w-full max-w-7xl mx-auto">
          {/* Content Grid */}
          <div className={`grid md:grid-cols-2 gap-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* Left: Photo */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-[3/4] bg-gradient-to-br from-amber-100 to-emerald-100 rounded-2xl shadow-2xl overflow-hidden border-4 border-amber-600/50">
                {/* Portrait Image */}
                <img 
                  src={currentEmperor.portrait} 
                  alt={`Portrait of ${currentEmperor.name}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Decorative Frame Corners */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-500/70 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-500/70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-500/70 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-500/70 pointer-events-none"></div>

                {/* Badge */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-amber-700/90 backdrop-blur-md px-4 py-2 rounded-full border-2 border-amber-400/50 pointer-events-none">
                  <p className="text-amber-100 font-bold text-sm text-center whitespace-nowrap">{currentEmperor.name}</p>
                </div>
              </div>
            </div>

            {/* Right: Information */}
            <div className="flex flex-col justify-center space-y-4 px-2">
              {/* Emperor Name */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                  {currentEmperor.name}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xl text-amber-300 font-semibold">📅 {currentEmperor.period}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-1 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full w-20"></div>

              {/* Summary Points */}
              <div>
                <h3 className="text-base font-bold text-white/90 mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-amber-500 to-emerald-500 rounded-full"></div>
                  Key Points
                </h3>
                <div className="space-y-1.5">
                  {currentEmperor.summary.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 group">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun Fact */}
              <div className="bg-gradient-to-r from-emerald-600/30 to-amber-600/30 border-l-4 border-amber-400 p-3 rounded-r-xl">
                <div className="flex items-start gap-2">
                  <span className="text-xl">🎯</span>
                  <div>
                    <p className="text-white/90 font-bold text-sm mb-1">Fun Fact</p>
                    <p className="text-gray-300 text-sm leading-relaxed italic">{currentEmperor.funFact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline Navigation - Fixed at bottom */}
      <div className="flex-shrink-0 bg-gradient-to-br from-emerald-800 to-green-900 border-t border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white p-2.5 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 flex-shrink-0"
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Timeline */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              {emperors.map((emperor, idx) => (
                <button
                  key={emperor.id}
                  onClick={() => handleTimelineClick(idx)}
                  className={`relative transition-all duration-300 ${
                    idx === currentIndex ? 'scale-110' : 'hover:scale-105'
                  }`}
                  title={emperor.name}
                >
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all font-bold text-sm ${
                    idx === currentIndex
                      ? 'bg-gradient-to-br from-amber-500 to-emerald-500 ring-2 ring-amber-400/50 shadow-xl text-white'
                      : 'bg-emerald-700/50 border-2 border-emerald-600/50 hover:border-amber-400/50 text-gray-400'
                  }`}>
                    {emperor.name.charAt(0)}
                  </div>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white p-2.5 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 flex-shrink-0"
              title="Next"
            >
              <ChevronRight size={18} />
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-emerald-600 mx-1 hidden sm:block"></div>

            {/* Autoplay Toggle */}
            <button
              onClick={togglePlayPause}
              className="bg-emerald-700/50 hover:bg-emerald-600/50 text-amber-400 p-2.5 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 border border-amber-400/30 flex-shrink-0"
              title={isPlaying ? "Pause autoplay" : "Resume autoplay"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            {/* Narration Button */}
            {speechSupported && (
              <button
                onClick={handleNarration}
                className={`p-2.5 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 flex-shrink-0 ${
                  isNarrating 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                    : 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                }`}
                title={isNarrating ? "Stop narration" : "Read aloud"}
              >
                <Volume2 size={18} className={isNarrating ? 'animate-pulse' : ''} />
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white p-2.5 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 flex-shrink-0"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-2">
            <span className="text-amber-300/70 text-xs font-medium">
              {currentIndex + 1} of {emperors.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
