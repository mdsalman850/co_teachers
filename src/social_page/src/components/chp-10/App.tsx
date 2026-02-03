import React, { useState } from 'react';
import { AppStage } from './types';
import { BasicsModule } from './components/BasicsModule';
import { TimelineModule } from './components/TimelineModule';
import { CommitteeModule } from './components/CommitteeModule';
import { RightsModule } from './components/RightsModule';
import { BookOpen, Users, History, Play, ShieldCheck, Maximize2, Minimize2 } from 'lucide-react';

interface AppProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const App: React.FC<AppProps> = ({ isFullscreen = false, onToggleFullscreen }) => {
  const [stage, setStage] = useState<AppStage>(AppStage.WELCOME);

  const renderStage = () => {
    switch (stage) {
      case AppStage.WELCOME:
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 font-serif bg-gradient-to-r from-blue-900 via-slate-800 to-blue-900 bg-clip-text text-transparent">
                Indian Constitution
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl leading-relaxed">
              Welcome to the Interactive Guide for Chapter 10. You will learn about the supreme law of India and the people who framed it.
            </p>
            <button
              onClick={() => setStage(AppStage.BASICS)}
              className="group bg-gradient-to-r from-blue-900 to-blue-800 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3 border-2 border-blue-700/50 hover:border-blue-600"
            >
              <span>Start Exploring</span>
              <Play size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );
      case AppStage.BASICS:
        return <BasicsModule />;
      case AppStage.TIMELINE:
        return <TimelineModule />;
      case AppStage.COMMITTEE:
        return <CommitteeModule />;
      case AppStage.RIGHTS:
        return <RightsModule />;
      default:
        return <div>Unknown Stage</div>;
    }
  };

  const NavItem = ({ target, icon: Icon, label }: { target: AppStage; icon: any; label: string }) => (
    <button
      onClick={() => setStage(target)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
        stage === target 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md scale-105' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 font-sans">
      {/* Header */}
      <header className={`sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm ${isFullscreen ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="cursor-pointer group transition-all duration-300" 
            onClick={() => setStage(AppStage.WELCOME)}
          >
             <span className="font-bold text-slate-900 text-lg hidden sm:block font-serif tracking-tight">
               Constitution Explorer
             </span>
          </div>
          
          <nav className="flex items-center gap-1 md:gap-2">
            <NavItem target={AppStage.BASICS} icon={BookOpen} label="Basics" />
            <NavItem target={AppStage.TIMELINE} icon={History} label="History" />
            <NavItem target={AppStage.COMMITTEE} icon={Users} label="Team" />
            <NavItem target={AppStage.RIGHTS} icon={ShieldCheck} label="Rights" />
            
            {/* Fullscreen Button */}
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 ml-2"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 size={18} strokeWidth={2.5} />
                ) : (
                  <Maximize2 size={18} strokeWidth={2.5} />
                )}
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 pt-8 md:pt-12 pb-0 max-w-7xl overflow-hidden">
        {renderStage()}
      </main>
    </div>
  );
};

export default App;