import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, Html } from '@react-three/drei';
import { RotateCcw, Maximize, Minimize } from 'lucide-react';

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
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 font-medium">Loading 3D Model...</p>
      </div>
    </Html>
  );
}

const ReliefFeaturesIndiaSimulator: React.FC = () => {
  const [key, setKey] = useState(0); // For resetting the view
  const [isFullscreen, setIsFullscreen] = useState(false);

  const modelFile = '/simulators/relief_features_india/india.glb';

  const resetView = () => {
    setKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const SimulatorContent = () => (
    <div className="relative bg-gradient-to-b from-blue-50 to-indigo-100 rounded-2xl overflow-hidden shadow-2xl">
      {/* Control Buttons - Grouped to prevent overlap */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-5 flex-wrap" style={{ maxWidth: 'calc(100% - 2rem)' }}>
        {/* Reset View Button */}
        <button
          onClick={resetView}
          className="px-4 py-2 bg-white/90 hover:bg-white rounded-lg flex items-center gap-2 shadow-lg transition-all hover:scale-105 whitespace-nowrap flex-shrink-0"
          aria-label="Reset view"
          style={{ margin: 0 }}
        >
          <RotateCcw className="w-4 h-4 text-gray-700 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700">Reset View</span>
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className="px-4 py-2 bg-white/90 hover:bg-white rounded-lg flex items-center gap-2 shadow-lg transition-all hover:scale-105 whitespace-nowrap flex-shrink-0"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          style={{ margin: 0 }}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4 text-gray-700 flex-shrink-0" />
          ) : (
            <Maximize className="w-4 h-4 text-gray-700 flex-shrink-0" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </span>
        </button>
      </div>

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
          camera={{ position: [0, 5, 10], fov: 50 }}
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
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.6} castShadow={false} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} castShadow={false} />
          <Suspense fallback={<Loader />}>
            <Model url={modelFile} />
            <Environment preset="sunset" background={false} />
          </Suspense>
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            minDistance={3}
            maxDistance={50}
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
          Physical Divisions Of India
        </h3>
        <p className={`text-blue-300 font-medium ${isFullscreen ? 'text-lg mb-2' : 'text-sm'}`}>
          Chapter 8 - Geography
        </p>
        {isFullscreen && (
          <p className="text-white/80 text-sm max-w-3xl">
            Explore the diverse topography of India including the Himalayan mountains in the north, 
            the Indo-Gangetic plains, the Deccan Plateau, and the coastal regions. This 3D model 
            shows the elevation differences and major landforms across the Indian subcontinent.
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className={`absolute bottom-4 right-4 z-20 flex gap-4 text-xs text-white/70 pointer-events-none ${
        isFullscreen ? 'bottom-20' : ''
      }`}>
        <span>🖱️ Drag to rotate</span>
        <span>🔍 Scroll to zoom</span>
        <span>⬅️➡️ Drag to pan</span>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Physical Divisions Of India - 3D Topography
        </h2>
        <p className="text-gray-600">
          Explore India's diverse landforms and topography in interactive 3D. Drag to rotate, scroll to zoom.
        </p>
      </div>

      {/* 3D Viewer Container */}
      {isFullscreen ? (
        <div className="fixed inset-0 z-[9999] bg-black">
          <SimulatorContent />
        </div>
      ) : (
        <SimulatorContent />
      )}

      {/* Description */}
      <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">About India's Physical Divisions</h3>
        <div className="space-y-2 text-gray-700 leading-relaxed">
          <p>
            India's topography is characterized by major physical divisions:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Northern Mountains:</strong> The Himalayan range forms the northern boundary with peaks over 8,000 meters</li>
            <li><strong>Northern Plains:</strong> The fertile Indo-Gangetic plains formed by the Indus, Ganga, and Brahmaputra rivers</li>
            <li><strong>Peninsular Plateau:</strong> The Deccan Plateau with the Western and Eastern Ghats mountain ranges</li>
            <li><strong>Coastal Plains:</strong> Narrow strips along the Arabian Sea and Bay of Bengal</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Preload the model
useGLTF.preload('/simulators/relief_features_india/india.glb');

export default ReliefFeaturesIndiaSimulator;
