import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, Html } from '@react-three/drei';
import { RotateCcw, Maximize, Minimize } from 'lucide-react';

// Simple model loader
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

// Loading indicator
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="mt-3 text-gray-600 font-medium">Loading 3D Model...</p>
      </div>
    </Html>
  );
}

const PhysicalDivisionsSimulator: React.FC = () => {
  const [key, setKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const modelFile = '/simulators/relief_features_india/india.glb';

  const resetView = () => setKey((prev) => prev + 1);
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const SimulatorContent = () => (
    <div className="relative bg-gradient-to-b from-blue-50 to-indigo-100 rounded-2xl overflow-hidden shadow-2xl">
      {/* Reset View */}
      <button
        onClick={resetView}
        className="absolute top-4 right-16 z-10 px-4 py-2 bg-white/90 hover:bg-white rounded-lg flex items-center gap-2 shadow-lg transition-all hover:scale-105"
        aria-label="Reset view"
      >
        <RotateCcw className="w-4 h-4 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">Reset View</span>
      </button>

      {/* Fullscreen */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-white/90 hover:bg-white rounded-lg flex items-center gap-2 shadow-lg transition-all hover:scale-105"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <Minimize className="w-4 h-4 text-gray-700" />
        ) : (
          <Maximize className="w-4 h-4 text-gray-700" />
        )}
        <span className="text-sm font-medium text-gray-700">
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </span>
      </button>

      {/* 3D Canvas */}
      <div
        className={`transition-all duration-300 ${isFullscreen ? '' : 'h-[600px]'}`}
        style={isFullscreen ? { height: '100vh', width: '100vw' } : {}}
      >
        <Canvas
          key={key}
          camera={{ position: [0, 5, 10], fov: 50 }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.6} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          <Suspense fallback={<Loader />}>
            <Model url={modelFile} />
            <Environment preset="sunset" />
          </Suspense>
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            autoRotate={false}
            minDistance={3}
            maxDistance={50}
          />
        </Canvas>
      </div>

      {/* Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none ${
          isFullscreen ? 'p-8' : 'p-6'
        }`}
      >
        <h3 className={`font-bold text-white mb-1 ${isFullscreen ? 'text-3xl' : 'text-2xl'}`}>
          Physical Divisions Of India
        </h3>
        <p className={`text-blue-300 font-medium ${isFullscreen ? 'text-lg mb-2' : 'text-sm'}`}>
          Chapter 8 - Geography
        </p>
        {isFullscreen && (
          <p className="text-white/80 text-sm max-w-3xl">
            Explore the Himalayas, Indo-Gangetic plains, Deccan Plateau, coastal plains, and
            islands in 3D. Rotate, zoom, and pan to see India&apos;s varied relief.
          </p>
        )}
      </div>

      {/* Instructions */}
      <div
        className={`absolute bottom-4 right-4 z-20 flex gap-4 text-xs text-white/70 pointer-events-none ${
          isFullscreen ? 'bottom-20' : ''
        }`}
      >
        <span>🖱️ Drag to rotate</span>
        <span>🔍 Scroll to zoom</span>
        <span>⬅️➡️ Drag to pan</span>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Physical Divisions Of India - 3D Topography
        </h2>
        <p className="text-gray-600">
          Explore India&apos;s diverse landforms and topography in interactive 3D. Drag to rotate,
          scroll to zoom.
        </p>
      </div>

      {isFullscreen ? (
        <div className="fixed inset-0 z-[9999] bg-black">
          <SimulatorContent />
        </div>
      ) : (
        <SimulatorContent />
      )}

      <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">About India&apos;s Physical Divisions</h3>
        <div className="space-y-2 text-gray-700 leading-relaxed">
          <p>India&apos;s topography is characterized by major physical divisions:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Northern Mountains:</strong> Himalayan ranges with peaks over 8,000 meters
            </li>
            <li>
              <strong>Northern Plains:</strong> Fertile Indo-Gangetic plains shaped by major rivers
            </li>
            <li>
              <strong>Peninsular Plateau:</strong> Deccan Plateau with Western and Eastern Ghats
            </li>
            <li>
              <strong>Coastal Plains:</strong> Western and Eastern coastal belts along Arabian Sea and Bay of Bengal
            </li>
            <li>
              <strong>Islands:</strong> Andaman &amp; Nicobar and Lakshadweep archipelagos
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Preload the GLB for faster load
useGLTF.preload('/simulators/relief_features_india/india.glb');

export default PhysicalDivisionsSimulator;
