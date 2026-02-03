import React, { useState, useEffect, useRef } from 'react';
import Chapter11NavBar from './Chapter11NavBar';
import Chapter11StructureLearn from './Chapter11StructureLearn';
import Chapter11EligibilitySimulator from './Chapter11EligibilitySimulator';
import Chapter11ComparisonView from './Chapter11ComparisonView';
import { ViewMode } from './chapter11/types';

const Chapter11Simulator: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>('learn');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenActive = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFullscreenActive);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Check initial state
    handleFullscreenChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (!isCurrentlyFullscreen) {
        // Enter fullscreen
        const element = containerRef.current;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
          await (element as any).mozRequestFullScreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full font-sans text-slate-900 antialiased ${isFullscreen ? 'fixed inset-0 bg-white z-[9999] overflow-auto' : ''}`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className={`sticky top-0 z-50 bg-white ${isFullscreen ? 'shadow-md' : 'rounded-t-2xl'}`}>
        <Chapter11NavBar 
          currentMode={mode} 
          setMode={setMode}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
      
      <main className={`pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-12 lg:pb-16 ${isFullscreen ? 'min-h-[calc(100vh-80px)]' : ''}`} style={{ scrollBehavior: 'smooth' }}>
        {mode === 'learn' && <Chapter11StructureLearn />}
        {mode === 'simulate' && <Chapter11EligibilitySimulator />}
        {mode === 'compare' && <Chapter11ComparisonView />}
      </main>
    </div>
  );
};

export default Chapter11Simulator;

