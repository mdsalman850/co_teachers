import React, { useState } from 'react';
import { Maximize, Minimize, Info } from 'lucide-react';

interface StomataSimulatorProps {
  className?: string;
}

const StomataSimulator: React.FC<StomataSimulatorProps> = ({ className = '' }) => {
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
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-3 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white drop-shadow-sm">Plant Stomata Structure</h3>
            <p className="text-green-100 text-xs font-medium">Chapter 3 - Respiration</p>
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
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200/50 p-5 shadow-sm animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-green-700">Plant Stomata Structure:</strong> Stomata are small pores found on the surface of leaves, stems, and other plant organs. 
                They consist of two specialized cells, known as guard cells, which surround a central pore. These structures play a crucial role 
                in regulating gas exchange, controlling water loss, and facilitating photosynthesis in plants.
              </p>
              <p className="text-xs text-gray-600 mt-3 font-medium bg-white/60 rounded-md p-2 border border-green-200/50">
                <strong className="text-green-600">Instructions:</strong> Use your mouse to rotate, scroll to zoom, and click on parts to learn more.
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
            title="Plant Stomata Structure"
            frameBorder="0"
            allowFullScreen
            mozAllowFullScreen={true}
            webkitAllowFullScreen={true}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src="https://sketchfab.com/models/00ffda2fc813426a9852abe6350332ca/embed"
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
              href="https://sketchfab.com/3d-models/plant-stomata-structure-00ffda2fc813426a9852abe6350332ca?utm_medium=embed&utm_campaign=share-popup&utm_content=00ffda2fc813426a9852abe6350332ca" 
              target="_blank" 
              rel="nofollow" 
              className="font-semibold text-green-300 hover:text-green-200 transition-colors hover:underline"
            >
              Plant Stomata Structure
            </a>
            {' by '}
            <a 
              href="https://sketchfab.com/h3ydari96?utm_medium=embed&utm_campaign=share-popup&utm_content=00ffda2fc813426a9852abe6350332ca" 
              target="_blank" 
              rel="nofollow" 
              className="font-semibold text-green-300 hover:text-green-200 transition-colors hover:underline"
            >
              Nima
            </a>
            {' on '}
            <a 
              href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=00ffda2fc813426a9852abe6350332ca" 
              target="_blank" 
              rel="nofollow" 
              className="font-semibold text-green-300 hover:text-green-200 transition-colors hover:underline"
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

export default StomataSimulator;

