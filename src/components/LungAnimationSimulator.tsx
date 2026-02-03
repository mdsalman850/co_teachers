import React, { useState } from 'react';
import { Maximize, Minimize, Info } from 'lucide-react';

interface LungAnimationSimulatorProps {
  className?: string;
}

const LungAnimationSimulator: React.FC<LungAnimationSimulatorProps> = ({ className = '' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  const SimulatorContent = () => (
    <div
      className={`relative bg-white rounded-xl shadow-xl border border-stone-200/50 overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col ${className}`}
      style={{
        ...(isFullscreen ? { 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 9999,
          borderRadius: 0,
          height: '100vh'
        } : {})
      }}
    >
      {/* Header */}
      {!isFullscreen && (
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 py-3 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white drop-shadow-sm">Lung Animation</h3>
            <p className="text-blue-100 text-xs font-medium">Chapter 3 - Respiration</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm shadow-sm"
            title="Information"
          >
            <Info className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm shadow-sm"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-white" />
            ) : (
              <Maximize className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
      )}

      {/* Info Panel */}
      {showInfo && !isFullscreen && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200/50 p-5 shadow-sm animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-blue-700">Lung Animation:</strong> This animation shows the movement of the lung and diaphragm muscle during breathing. 
                For humans, the typical respiratory rate for a healthy adult at rest is 12–18 breaths per minute. The respiratory center 
                sets the quiet respiratory rhythm at around two seconds for an inhalation and three seconds exhalation.
              </p>
              <p className="text-xs text-gray-600 mt-3 font-medium bg-white/60 rounded-md p-2 border border-blue-200/50">
                <strong className="text-blue-600">Instructions:</strong> Watch the animated breathing cycle. Use your mouse to rotate, scroll to zoom, and interact with the model.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sketchfab Embed */}
      <div 
        className={`relative bg-black ${isFullscreen ? 'flex-1' : ''}`}
        style={{
          height: isFullscreen ? 'auto' : '650px',
          width: '100%',
          minHeight: isFullscreen ? 0 : '650px'
        }}
      >
        {/* Exit Fullscreen Button */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-all duration-200 backdrop-blur-sm shadow-lg"
            title="Exit Fullscreen"
          >
            <Minimize className="w-5 h-5" />
          </button>
        )}
        <div className="sketchfab-embed-wrapper" style={{ width: '100%', height: '100%', borderRadius: '0' }}>
          <iframe
            title="Lung animation"
            frameBorder="0"
            allowFullScreen
            mozAllowFullScreen={true}
            webkitAllowFullScreen={true}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src="https://sketchfab.com/models/acbb5f0e16a14179ae4f63c5b6b83ad7/embed"
            className="rounded-b-xl"
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />
        </div>
        {!isFullscreen && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-2">
          <p className="text-xs text-center text-white/90 font-medium">
            <a 
              href="https://sketchfab.com/3d-models/lung-animation-acbb5f0e16a14179ae4f63c5b6b83ad7?utm_medium=embed&utm_campaign=share-popup&utm_content=acbb5f0e16a14179ae4f63c5b6b83ad7" 
              target="_blank" 
              rel="nofollow" 
              className="font-semibold text-blue-300 hover:text-blue-200 transition-colors hover:underline"
            >
              Lung animation
            </a>
            {' by '}
            <a 
              href="https://sketchfab.com/Ebers?utm_medium=embed&utm_campaign=share-popup&utm_content=acbb5f0e16a14179ae4f63c5b6b83ad7" 
              target="_blank" 
              rel="nofollow" 
              className="font-semibold text-blue-300 hover:text-blue-200 transition-colors hover:underline"
            >
              Ebers
            </a>
            {' on '}
            <a 
              href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=acbb5f0e16a14179ae4f63c5b6b83ad7" 
              target="_blank" 
              rel="nofollow" 
              className="font-semibold text-blue-300 hover:text-blue-200 transition-colors hover:underline"
            >
              Sketchfab
            </a>
          </p>
        </div>
        )}
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black">
        <SimulatorContent />
      </div>
    );
  }

  return <SimulatorContent />;
};

export default LungAnimationSimulator;

