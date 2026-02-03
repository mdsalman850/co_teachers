import React from 'react';
import { ViewMode } from './chapter11/types';
import { BookOpen, UserCheck, Scale, Maximize2, Minimize2 } from 'lucide-react';

interface NavBarProps {
  currentMode: ViewMode;
  setMode: (mode: ViewMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const Chapter11NavBar: React.FC<NavBarProps> = ({ currentMode, setMode, isFullscreen, onToggleFullscreen }) => {
  return (
    <nav className="bg-white/98 backdrop-blur-md border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center gap-2 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-[0_4px_12px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/20">
              GOV
            </div>
            <span className="font-bold text-base sm:text-lg lg:text-xl text-slate-900 hidden sm:block tracking-tight leading-tight">Indian Governance Simulator</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex space-x-1 sm:space-x-1.5 bg-slate-100/60 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-slate-200/50">
            <button
              onClick={() => setMode('learn')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ease-out ${
                currentMode === 'learn' 
                  ? 'bg-white text-indigo-700 shadow-[0_2px_8px_rgba(99,102,241,0.15)] ring-1 ring-indigo-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <BookOpen size={16} className="sm:w-[17px] sm:h-[17px]" strokeWidth={2.5} />
              <span className="hidden sm:inline">Learn Structure</span>
            </button>
            <button
              onClick={() => setMode('simulate')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ease-out ${
                currentMode === 'simulate' 
                  ? 'bg-white text-indigo-700 shadow-[0_2px_8px_rgba(99,102,241,0.15)] ring-1 ring-indigo-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <UserCheck size={16} className="sm:w-[17px] sm:h-[17px]" strokeWidth={2.5} />
              <span className="hidden sm:inline">Check Eligibility</span>
            </button>
            <button
              onClick={() => setMode('compare')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ease-out ${
                currentMode === 'compare' 
                  ? 'bg-white text-indigo-700 shadow-[0_2px_8px_rgba(99,102,241,0.15)] ring-1 ring-indigo-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Scale size={16} className="sm:w-[17px] sm:h-[17px]" strokeWidth={2.5} />
              <span className="hidden sm:inline">Compare Powers</span>
            </button>
            </div>
            
            {/* Fullscreen Button */}
            <button
              onClick={onToggleFullscreen}
              className="flex items-center justify-center p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/70 transition-all duration-300 ease-out bg-slate-100/60 border border-slate-200/50"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
              ) : (
                <Maximize2 size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Chapter11NavBar;

