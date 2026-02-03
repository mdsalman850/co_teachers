import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, Html } from '@react-three/drei';
import { RotateCcw, Maximize, Minimize, X, Info } from 'lucide-react';

// 3D Model Component - Optimized for performance
const Model = React.memo(({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  
  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  );
});

Model.displayName = 'Model';

// Loading component
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 font-medium">Loading Earth Core Model...</p>
      </div>
    </Html>
  );
}

interface EarthCoreSimulatorProps {
  className?: string;
}

const EarthCoreSimulator: React.FC<EarthCoreSimulatorProps> = ({ className = '' }) => {
  const [key, setKey] = useState(0); // For resetting the view
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const modelFile = '/simulators/earth_core/earth_core_v2.glb';

  const resetView = () => {
    setKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const SimulatorContent = () => (
    <div className="relative bg-gradient-to-b from-slate-900 via-red-950 to-black rounded-2xl overflow-hidden shadow-2xl">
      {/* Control Buttons */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 flex-wrap">
        <button
          onClick={resetView}
          className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-all hover:scale-105"
          aria-label="Reset view"
          title="Reset View"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-300 ${
            showInfo 
              ? 'bg-blue-500/80 text-white hover:bg-blue-600/80' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          title="Show Info"
        >
          <Info className="w-5 h-5" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-all hover:scale-105"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-16 right-4 z-10 w-72 bg-black/70 backdrop-blur-md rounded-lg p-4 text-white border border-white/20">
          <h4 className="font-bold text-orange-400 mb-2">🌍 Earth's Interior Structure</h4>
          <ul className="text-sm space-y-1 text-gray-200">
            <li>🌋 <strong>Crust:</strong> Thin outer layer (5-70 km)</li>
            <li>🌋 <strong>Mantle:</strong> Thick middle layer (2,900 km)</li>
            <li>🔥 <strong>Outer Core:</strong> Liquid iron and nickel</li>
            <li>⚡ <strong>Inner Core:</strong> Solid iron-nickel center</li>
          </ul>
          <p className="text-xs text-gray-400 mt-3">
            <strong>Tip:</strong> Rotate and zoom to explore Earth's layers!
          </p>
        </div>
      )}

      {/* 3D Canvas */}
      <div 
        className={`transition-all duration-300 ${isFullscreen ? '' : 'h-[600px]'}`}
        style={{ 
          ...(isFullscreen ? { height: '100vh', width: '100vw' } : {}),
          willChange: 'transform',
          transform: 'translateZ(0)' // GPU acceleration
        }}
      >
        <Canvas
          key={key}
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ 
            antialias: true, 
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
            alpha: false,
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: false,
            precision: "mediump"
          }}
          dpr={Math.min(window.devicePixelRatio, 2)}
          performance={{ min: 0.5, max: 1, debounce: 200 }}
          frameloop="always"
          shadows={false}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow={false} />
          <directionalLight position={[-10, -10, -5]} intensity={0.4} castShadow={false} />
          <pointLight position={[0, 0, 0]} intensity={1.5} color="#FF6B35" />
          <Suspense fallback={<Loader />}>
            <Model url={modelFile} />
            <Environment preset="sunset" background={false} />
          </Suspense>
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            minDistance={2}
            maxDistance={15}
            dampingFactor={0.05}
            enableDamping={true}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            panSpeed={0.8}
            makeDefault
          />
        </Canvas>
      </div>

      {/* Model Name Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none ${
        isFullscreen ? 'p-8' : 'p-6'
      }`}>
        <h3 className={`font-bold text-white mb-1 ${isFullscreen ? 'text-3xl' : 'text-2xl'}`}>
          Earth's Core Structure
        </h3>
        <p className={`text-orange-300 font-medium ${isFullscreen ? 'text-lg mb-2' : 'text-sm'}`}>
          Chapter 6 - Our Universe
        </p>
        {isFullscreen && (
          <p className="text-white/80 text-sm max-w-3xl">
            Explore the internal structure of Earth in 3D. This model shows the cross-section of Earth's layers 
            including the crust, mantle, outer core, and inner core. Rotate and zoom to examine each layer in detail.
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className={`absolute bottom-4 left-4 z-20 flex gap-4 text-xs text-white/70 pointer-events-none ${
        isFullscreen ? 'bottom-20' : ''
      }`}>
        <span>🖱️ Drag to rotate</span>
        <span>🔍 Scroll to zoom</span>
        <span>⬅️➡️ Drag to pan</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Regular View */}
      <div className={`${className}`}>
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">🌍 Earth's Core Structure</h3>
          <p className="text-gray-600">Explore Earth's interior layers in interactive 3D - rotate and zoom to see the crust, mantle, and core!</p>
        </div>
        <div className="relative w-full h-[600px] border border-gray-300 rounded-lg overflow-hidden shadow-xl">
          <SimulatorContent />
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black">
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-[10000] p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all duration-300"
            title="Exit Fullscreen"
          >
            <X className="w-6 h-6" />
          </button>
          <SimulatorContent />
        </div>
      )}
    </>
  );
};

// Preload the model
useGLTF.preload('/simulators/earth_core/earth_core_v2.glb');

export default EarthCoreSimulator;
