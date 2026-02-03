import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, Html } from '@react-three/drei';
import { ChevronLeft, ChevronRight, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

// Model data with individual camera settings
const models = [
  {
    id: 1,
    name: 'Seal from the Indus Valley Civilization',
    description: 'An ancient seal featuring a unicorn-like animal, used for trade and identification in the Indus Valley Civilization (2500-1500 BCE). These seals were typically made of steatite and featured pictographic inscriptions.',
    file: '/simulators/ancient_india/seal_from_the_indus_valley_civilization.glb',
    period: 'Indus Valley Civilization (2500-1500 BCE)',
    cameraPosition: [0, 0, 3] as [number, number, number],
    fov: 45
  },
  {
    id: 2,
    name: 'Mauryan Period Silver Karshapana',
    description: 'A silver punch-marked coin from the Mauryan Empire, featuring various symbols including the sun stamp, triple hill/stupa stamp, and caduceus stamp. These coins were used as currency during the reign of the Mauryan dynasty.',
    file: '/simulators/ancient_india/mauryan_period_silver_karshapana.glb',
    period: 'Mauryan Empire (322-185 BCE)',
    cameraPosition: [0, 0, 2.5] as [number, number, number],
    fov: 45
  },
  {
    id: 3,
    name: 'The Great Bath',
    description: 'A remarkable public water tank discovered in Mohenjo-daro, one of the earliest public water tanks in the ancient world. It measures approximately 12m × 7m and 2.4m deep, showcasing advanced engineering of the Indus Valley Civilization.',
    file: '/simulators/ancient_india/the_great_bath.glb',
    period: 'Indus Valley Civilization (2500-1500 BCE)',
    cameraPosition: [0, 4, 8] as [number, number, number],
    fov: 50
  }
];

// 3D Model Component
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  );
}

// Loading component
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-white font-medium">Loading 3D Model...</p>
      </div>
    </Html>
  );
}

interface AncientIndiaSimulatorProps {
  className?: string;
}

const AncientIndiaSimulator: React.FC<AncientIndiaSimulatorProps> = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentModel = models[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? models.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === models.length - 1 ? 0 : prev + 1));
  };

  const resetView = () => {
    setKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-2">
            Ancient India 3D Artifacts
          </h2>
          <p className="text-stone-600">
            Explore historical artifacts from Ancient India in 3D. Drag to rotate, scroll to zoom.
          </p>
        </div>
      )}

      {/* 3D Viewer Container - Transforms to fullscreen */}
      <div 
        className={`relative bg-gradient-to-b from-stone-800 to-stone-900 overflow-hidden shadow-2xl transition-all duration-300 ${
          isFullscreen 
            ? 'fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-[99999] rounded-none border-none' 
            : 'rounded-2xl border border-stone-300'
        }`}
        style={isFullscreen ? { 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh',
          zIndex: 99999
        } : {}}
      >
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${
            isFullscreen ? 'w-14 h-14' : 'w-12 h-12'
          }`}
          aria-label="Previous model"
        >
          <ChevronLeft className={isFullscreen ? 'w-8 h-8 text-stone-700' : 'w-6 h-6 text-stone-700'} />
        </button>

        <button
          onClick={goToNext}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${
            isFullscreen ? 'w-14 h-14' : 'w-12 h-12'
          }`}
          aria-label="Next model"
        >
          <ChevronRight className={isFullscreen ? 'w-8 h-8 text-stone-700' : 'w-6 h-6 text-stone-700'} />
        </button>

        {/* Top Controls */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <button
            onClick={resetView}
            className="px-4 py-2 bg-white/90 hover:bg-white rounded-lg flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            aria-label="Reset view"
          >
            <RotateCcw className="w-4 h-4 text-stone-700" />
            <span className="text-sm font-medium text-stone-700">Reset View</span>
          </button>
        </div>

        {/* Model Counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-white/90 rounded-lg shadow-lg">
          <span className="text-sm font-medium text-stone-700">
            {currentIndex + 1} / {models.length}
          </span>
        </div>

        {/* Fullscreen Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleFullscreen}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all hover:scale-105 ${
              isFullscreen 
                ? 'bg-white/90 hover:bg-white' 
                : 'bg-amber-500 hover:bg-amber-600'
            }`}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Full view'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-stone-700" />
                <span className="text-sm font-medium text-stone-700">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Full View</span>
              </>
            )}
          </button>
        </div>

        {/* 3D Canvas - Single instance that resizes */}
        <div 
          className={`transition-all duration-300 ${isFullscreen ? '' : 'h-[500px]'}`}
          style={isFullscreen ? { height: '100vh', width: '100vw' } : {}}
        >
          <Canvas
            key={`${key}-${currentIndex}`}
            camera={{ position: currentModel.cameraPosition, fov: currentModel.fov }}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
          >
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />
            <directionalLight position={[-10, -10, -5]} intensity={0.2} />
            <Suspense fallback={<Loader />}>
              <Model url={currentModel.file} />
              <Environment preset="warehouse" />
            </Suspense>
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={true}
              autoRotateSpeed={1}
            />
          </Canvas>
        </div>

        {/* Model Name Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none ${
          isFullscreen ? 'p-8' : 'p-6'
        }`}>
          <h3 className={`font-bold text-white mb-1 ${isFullscreen ? 'text-3xl' : 'text-2xl'}`}>
            {currentModel.name}
          </h3>
          <p className={`text-amber-300 font-medium ${isFullscreen ? 'text-lg mb-2' : 'text-sm'}`}>
            {currentModel.period}
          </p>
          {isFullscreen && (
            <p className="text-white/80 text-sm max-w-3xl">
              {currentModel.description}
            </p>
          )}
        </div>

        {/* Fullscreen Instructions */}
        {isFullscreen && (
          <div className="absolute bottom-4 right-4 z-20 flex gap-4 text-xs text-white/70 pointer-events-none">
            <span>🖱️ Drag to rotate</span>
            <span>🔍 Scroll to zoom</span>
            <span>⬅️➡️ Navigate</span>
            <span>ESC to exit</span>
          </div>
        )}
      </div>

      {/* Description - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-md">
          <p className="text-stone-700 leading-relaxed">
            {currentModel.description}
          </p>
        </div>
      )}

      {/* Thumbnail Navigation - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="flex justify-center gap-4">
          {models.map((model, index) => (
            <button
              key={model.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                index === currentIndex
                  ? 'bg-amber-100 border-2 border-amber-500 shadow-md'
                  : 'bg-stone-50 border-2 border-transparent hover:bg-stone-100'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mb-2 ${
                  index === currentIndex ? 'bg-amber-500' : 'bg-stone-300'
                }`}
              />
              <span
                className={`text-xs font-medium text-center max-w-[120px] ${
                  index === currentIndex ? 'text-amber-700' : 'text-stone-600'
                }`}
              >
                {model.name.length > 25 ? model.name.substring(0, 25) + '...' : model.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Instructions - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="flex justify-center gap-8 text-sm text-stone-500 bg-stone-100 rounded-lg p-4">
          <span className="flex items-center gap-2">
            <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">🖱️</span>
            Drag to rotate
          </span>
          <span className="flex items-center gap-2">
            <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">🔍</span>
            Scroll to zoom
          </span>
          <span className="flex items-center gap-2">
            <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">⬅️➡️</span>
            Arrows to navigate
          </span>
        </div>
      )}
    </div>
  );
};

// Preload all models
models.forEach((model) => {
  useGLTF.preload(model.file);
});

export default AncientIndiaSimulator;
