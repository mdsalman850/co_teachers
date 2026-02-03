import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Calendar, Pause, Play, Maximize, Minimize } from 'lucide-react';

interface India9th14thSimulatorProps {
  className?: string;
}

const India9th14thSimulator = ({ className = '' }: India9th14thSimulatorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const rulers = [
    {
      name: "Mahmud of Ghazni",
      period: "971-1030 CE",
      dynasty: "Ghaznavid Empire",
      gradient: "from-amber-600 to-orange-700",
      portrait: "/images/india_9th_14th/mahmud_ghaznavi.png",
      achievements: [
        "Led 17 raids into India, targeting wealthy temples",
        "Patron of literature, art, and culture",
        "His court at Ghazni was a hub for poets and scholars",
        "Established Ghazni as a premier intellectual center"
      ],
      funFact: "Ghazni became one of the richest cities of its time, rivaling Baghdad and Constantinople!"
    },
    {
      name: "Mohammed Ghori",
      period: "1173-1206 CE",
      dynasty: "Ghurid Dynasty",
      gradient: "from-rose-600 to-red-700",
      portrait: "/images/india_9th_14th/muhammad_ghori.png",
      achievements: [
        "Key ruler of the Ghurid dynasty in Afghanistan",
        "Expanded into India; defeated Prithviraj Chauhan",
        "Laid foundation for the Delhi Sultanate",
        "Ruled mostly through generals while managing vast empire"
      ],
      funFact: "He rarely stayed in India, ruling mostly through generals while managing his vast empire!"
    },
    {
      name: "Qutbuddin Aibak",
      period: "1206-1210 CE",
      dynasty: "Mamluk (Slave) Dynasty",
      gradient: "from-emerald-600 to-teal-700",
      portrait: "/images/india_9th_14th/qutbuddin_aibak.png",
      achievements: [
        "Former Turkic slave → became first Sultan of Delhi",
        "Started the Mamluk/Ghulam dynasty",
        "Commissioned Qutub Minar as a victory monument",
        "Known as 'Lakh Baksh' (giver of lakhs) for generosity"
      ],
      funFact: "He was known as 'Lakh Baksh' (giver of lakhs) for his extraordinary generosity!"
    },
    {
      name: "Alauddin Khilji",
      period: "1290-1320 CE",
      dynasty: "Khilji Dynasty",
      gradient: "from-purple-600 to-violet-700",
      portrait: "/images/india_9th_14th/khilji_dynasty.png",
      achievements: [
        "Founded by Jalaluddin; reached peak under Alauddin Khilji",
        "Repelled Mongol invasions and conquered the Deccan",
        "Introduced the 'dagh' horse-branding system for army discipline",
        "Controlled market prices to prevent inflation"
      ],
      funFact: "Alauddin controlled market prices to prevent inflation - one of history's first price control systems!"
    },
    {
      name: "Bahlul Lodi",
      period: "1451-1489 CE",
      dynasty: "Lodi Dynasty",
      gradient: "from-blue-600 to-indigo-700",
      portrait: "/images/india_9th_14th/bahlul_lodi.jpg",
      achievements: [
        "Founder of the Lodi dynasty after the Sayyids",
        "Expanded Delhi Sultanate territory",
        "Strengthened central authority through reforms",
        "United Afghan nobles under his leadership"
      ],
      funFact: "He skillfully navigated the transition from Sayyid to Lodi rule, strengthening Delhi's power when it was at its weakest!"
    }
  ];

  const currentRuler = rulers[currentIndex];

  useEffect(() => {
    if (isAutoplay) {
      const timer = setTimeout(() => {
        handleNext();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isAutoplay]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % rulers.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + rulers.length) % rulers.length);
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

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 text-center py-3 px-4 border-b border-amber-900/30">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="text-amber-400" size={24} />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
            Medieval India
          </h1>
          <Sparkles className="text-amber-400" size={24} />
        </div>
        <p className="text-amber-300/70 text-sm">9th to 14th Century CE • Chapter 2</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="w-full max-w-7xl mx-auto">
          {/* Content Grid */}
          <div className={`grid md:grid-cols-2 gap-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* Left: Photo */}
            <div className="flex items-center justify-center">
              <div className={`relative w-full max-w-sm aspect-[3/4] bg-gradient-to-br ${currentRuler.gradient} rounded-2xl shadow-2xl overflow-hidden border-4 border-amber-900/50`}>
                {/* Portrait Image */}
                <img 
                  src={currentRuler.portrait} 
                  alt={`Portrait of ${currentRuler.name}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Decorative Frame Corners */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-400/70 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-400/70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-400/70 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-amber-400/70 pointer-events-none"></div>

                {/* Badge */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-amber-900/90 backdrop-blur-md px-4 py-2 rounded-full border-2 border-amber-400/50 pointer-events-none">
                  <p className="text-amber-100 font-bold text-sm text-center whitespace-nowrap">{currentRuler.name}</p>
                </div>
              </div>
            </div>

            {/* Right: Information */}
            <div className="flex flex-col justify-center space-y-4 px-2">
              {/* Title Section */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                  {currentRuler.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-amber-400" />
                  <p className="text-xl text-amber-300 font-semibold">{currentRuler.period}</p>
                </div>
              </div>

              {/* Divider */}
              <div className={`h-1 bg-gradient-to-r ${currentRuler.gradient} rounded-full w-20`}></div>

              {/* Achievements */}
              <div>
                <h3 className="text-base font-bold text-white/90 mb-2 flex items-center gap-2">
                  <div className={`w-1 h-4 bg-gradient-to-b ${currentRuler.gradient} rounded-full`}></div>
                  Major Achievements
                </h3>
                <div className="space-y-1.5">
                  {currentRuler.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-start gap-2 group">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm leading-relaxed">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun Fact */}
              <div className={`bg-gradient-to-r ${currentRuler.gradient} bg-opacity-10 border-l-4 border-amber-400 p-3 rounded-r-xl`}>
                <div className="flex items-start gap-2">
                  <Sparkles className="text-amber-400 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-white/90 font-bold text-sm mb-1">Did You Know?</p>
                    <p className="text-gray-300 text-sm leading-relaxed italic">{currentRuler.funFact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline Navigation - Fixed at bottom */}
      <div className="flex-shrink-0 bg-gradient-to-br from-slate-800 to-slate-900 border-t border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white p-2.5 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 flex-shrink-0"
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Timeline */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              {rulers.map((ruler, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTimelineClick(idx)}
                  className={`relative transition-all duration-300 ${
                    idx === currentIndex ? 'scale-110' : 'hover:scale-105'
                  }`}
                  title={ruler.name}
                >
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all font-bold text-sm ${
                    idx === currentIndex
                      ? `bg-gradient-to-br ${ruler.gradient} ring-2 ring-amber-400/50 shadow-xl text-white`
                      : 'bg-slate-700/50 border-2 border-slate-600/50 hover:border-amber-400/50 text-gray-400'
                  }`}>
                    {ruler.name.charAt(0)}
                  </div>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white p-2.5 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 flex-shrink-0"
              title="Next"
            >
              <ChevronRight size={18} />
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-600 mx-1 hidden sm:block"></div>

            {/* Autoplay Toggle */}
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-amber-400 p-2.5 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 border border-amber-400/30 flex-shrink-0"
              title={isAutoplay ? "Pause autoplay" : "Resume autoplay"}
            >
              {isAutoplay ? <Pause size={18} /> : <Play size={18} />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-2.5 sm:p-3 rounded-full shadow-lg transition-all hover:scale-110 flex-shrink-0"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-2">
            <span className="text-amber-300/70 text-xs font-medium">
              {currentIndex + 1} of {rulers.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default India9th14thSimulator;