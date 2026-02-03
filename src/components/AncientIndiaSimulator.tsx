import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, Html } from '@react-three/drei';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

// Model data with individual camera settings
const models = [
  {
    id: 1,
    name: 'Seal from the Indus Valley Civilization',
    description: 'An ancient seal featuring a unicorn-like animal, used for trade and identification in the Indus Valley Civilization (2500-1500 BCE).',
    file: '/simulators/ancient_india/seal_from_the_indus_valley_civilization.glb',
    period: 'Indus Valley Civilization (2500-1500 BCE)',
    cameraPosition: [0, 0, 3] as [number, number, number],
    fov: 45
  },
  {
    id: 2,
    name: 'Mauryan Period Silver Karshapana',
    description: 'A silver punch-marked coin from the Mauryan Empire, featuring various symbols including the sun stamp and triple hill/stupa stamp.',
    file: '/simulators/ancient_india/mauryan_period_silver_karshapana.glb',
    period: 'Mauryan Empire (322-185 BCE)',
    cameraPosition: [0, 0, 2.5] as [number, number, number],
    fov: 45
  },
  {
    id: 3,
    name: 'The Great Bath',
    description: 'A remarkable public water tank in Mohenjo-daro, one of the earliest public water tanks in the ancient world.',
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
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 font-medium">Loading 3D Model...</p>
      </div>
    </Html>
  );
}

const AncientIndiaSimulator: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0); // For resetting the view

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Ancient India 3D Artifacts
        </h2>
        <p className="text-gray-600">
          Explore historical artifacts from Ancient India in 3D. Drag to rotate, scroll to zoom.
        </p>
      </div>

      {/* 3D Viewer Container */}
      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          aria-label="Previous model"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          aria-label="Next model"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* Reset View Button */}
        <button
          onClick={resetView}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-white/90 hover:bg-white rounded-lg flex items-center gap-2 shadow-lg transition-all hover:scale-105"
          aria-label="Reset view"
        >
          <RotateCcw className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-medium text-gray-700">Reset View</span>
        </button>

        {/* Model Counter */}
        <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/90 rounded-lg shadow-lg">
          <span className="text-sm font-medium text-gray-700">
            {currentIndex + 1} / {models.length}
          </span>
        </div>

        {/* 3D Canvas */}
        <div className="h-[450px]">
          <Canvas
            key={`${key}-${currentIndex}`}
            camera={{ position: currentModel.cameraPosition, fov: currentModel.fov }}
            gl={{ antialias: true }}
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h3 className="text-2xl font-bold text-white mb-1">
            {currentModel.name}
          </h3>
          <p className="text-orange-300 font-medium text-sm">
            {currentModel.period}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
        <p className="text-gray-700 leading-relaxed">
          {currentModel.description}
        </p>
      </div>

      {/* Thumbnail Navigation */}
      <div className="mt-6 flex justify-center gap-4">
        {models.map((model, index) => (
          <button
            key={model.id}
            onClick={() => setCurrentIndex(index)}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
              index === currentIndex
                ? 'bg-orange-100 border-2 border-orange-500 shadow-md'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full mb-2 ${
                index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />
            <span
              className={`text-xs font-medium text-center max-w-[100px] ${
                index === currentIndex ? 'text-orange-700' : 'text-gray-600'
              }`}
            >
              {model.name.split(' ').slice(0, 3).join(' ')}...
            </span>
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500">
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">🖱️</span>
          Drag to rotate
        </span>
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">🔍</span>
          Scroll to zoom
        </span>
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">⬅️➡️</span>
          Arrows to navigate
        </span>
      </div>
    </div>
  );
};

// Preload all models
models.forEach((model) => {
  useGLTF.preload(model.file);
});

export default AncientIndiaSimulator;

