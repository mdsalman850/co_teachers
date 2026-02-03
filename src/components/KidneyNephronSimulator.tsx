import React, { useState } from 'react';
import { Maximize, Minimize, Info } from 'lucide-react';

interface KidneyNephronSimulatorProps {
  className?: string;
}

const KidneyNephronSimulator: React.FC<KidneyNephronSimulatorProps> = ({ className = '' }) => {
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 py-3 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white drop-shadow-sm">Kidney Nephron Structure Anatomy</h3>
            <p className="text-indigo-100 text-xs font-medium">Chapter 5 - Excretion</p>
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
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200/50 p-5 shadow-sm animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-indigo-700">Kidney Nephron Structure Anatomy:</strong> The nephron is the microscopic functional unit of the kidney responsible for filtering blood and forming urine. 
                Each kidney contains approximately one million nephrons. A nephron consists of a renal corpuscle (containing the glomerulus and Bowman's capsule) 
                and a renal tubule (including the proximal convoluted tubule, loop of Henle, distal convoluted tubule, and collecting duct). 
                This 3D model shows the detailed structure and blood supply of a nephron.
              </p>
              <p className="text-xs text-gray-600 mt-3 font-medium bg-white/60 rounded-md p-2 border border-indigo-200/50">
                <strong className="text-indigo-600">Instructions:</strong> Use your mouse to rotate, scroll to zoom, and click on labeled parts to understand the structure and function of the nephron.
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
            title="Kidney Nephron Structure Anatomy"
            frameBorder="0"
            allowFullScreen
            mozAllowFullScreen={true}
            webkitAllowFullScreen={true}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src="https://sketchfab.com/models/83474e067b634fd2b40d8f83beb1473a/embed"
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
              href="https://sketchfab.com/3d-models/kidney-nephron-structure-anatomy-83474e067b634fd2b40d8f83beb1473a?utm_medium=embed&utm_campaign=share-popup&utm_content=83474e067b634fd2b40d8f83beb1473a" 
              target="_blank" 
              rel="nofollow" 
              className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors hover:underline"
            >
              Kidney Nephron Structure Anatomy
            </a>
            {' by '}
            <a 
              href="https://sketchfab.com/h3ydari96?utm_medium=embed&utm_campaign=share-popup&utm_content=83474e067b634fd2b40d8f83beb1473a" 
              target="_blank" 
              rel="nofollow" 
              className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors hover:underline"
            >
              Nima
            </a>
            {' on '}
            <a 
              href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=83474e067b634fd2b40d8f83beb1473a" 
              target="_blank" 
              rel="nofollow" 
              className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors hover:underline"
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

export default KidneyNephronSimulator;
