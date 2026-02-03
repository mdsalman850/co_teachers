import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stars, Html } from '@react-three/drei';
import { Maximize, Minimize, X, RotateCcw, Info } from 'lucide-react';
import * as THREE from 'three';

// Planet name mapping (model name -> display name)
const planetNames: Record<string, { name: string; emoji: string; description: string }> = {
  'sun_53': { name: 'Sun', emoji: '☀️', description: 'The star at the center of our solar system' },
  'mercury_2': { name: 'Mercury', emoji: '🪨', description: 'The smallest and fastest planet' },
  'venus_5': { name: 'Venus', emoji: '🌟', description: 'The hottest planet in our solar system' },
  'erath_8': { name: 'Earth', emoji: '🌍', description: 'Our home planet - the blue marble' },
  'mars_12': { name: 'Mars', emoji: '🔴', description: 'The Red Planet' },
  'jupiter_15': { name: 'Jupiter', emoji: '🪐', description: 'The largest planet in our solar system' },
  'saturn_19': { name: 'Saturn', emoji: '💫', description: 'Famous for its beautiful rings' },
  'uranus_22': { name: 'Uranus', emoji: '🔵', description: 'The ice giant that rotates on its side' },
  'neptune_25': { name: 'Neptune', emoji: '🌊', description: 'The windiest planet' },
};

// Hover Tooltip Component
const PlanetTooltip = ({ position, planetInfo, visible }: { 
  position: THREE.Vector3; 
  planetInfo: { name: string; emoji: string; description: string } | null;
  visible: boolean;
}) => {
  if (!visible || !planetInfo) return null;
  
  return (
    <Html position={position} center style={{ pointerEvents: 'none' }}>
      <div className="bg-black/80 backdrop-blur-md text-white px-3 py-2.5 rounded-lg border border-white/30 shadow-2xl transform -translate-y-16 animate-fade-in w-[180px] break-words">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl flex-shrink-0">{planetInfo.emoji}</span>
          <span className="font-bold text-base text-amber-400 break-words leading-tight">{planetInfo.name}</span>
        </div>
        <p className="text-xs text-gray-300 break-words leading-relaxed">{planetInfo.description}</p>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black/80"></div>
        </div>
      </div>
    </Html>
  );
};

// Solar System 3D Model Component with Hover Detection
const SolarSystemModel = ({ 
  autoRotate, 
  onHover, 
  onHoverEnd 
}: { 
  autoRotate: boolean;
  onHover: (position: THREE.Vector3, planetName: string) => void;
  onHoverEnd: () => void;
}) => {
  const { scene } = useGLTF('/simulators/solar_system/solar_system_animation.glb');
  const groupRef = useRef<THREE.Group>(null);
  const hasAdjusted = useRef(false);
  const { raycaster, camera, pointer } = useThree();
  const [planetMeshes, setPlanetMeshes] = useState<THREE.Object3D[]>([]);

  // Setup: Remove moon, pluto and collect planet meshes
  useEffect(() => {
    if (scene && !hasAdjusted.current) {
      hasAdjusted.current = true;
      const meshes: THREE.Object3D[] = [];
      
      scene.traverse((child) => {
        // Remove moon
        if (child.name === 'moon_31') {
          child.visible = false;
        }
        
        // Remove Pluto and its orbit
        if (child.name === 'pluto_28' || child.name.includes('pluto')) {
          child.visible = false;
          console.log('🔴 Removed Pluto:', child.name);
        }
        
        // Collect planet meshes for hover detection
        if (planetNames[child.name]) {
          meshes.push(child);
          // Make sure the object can receive raycasts
          child.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              meshes.push(obj);
              // Store parent name for reference
              (obj as any).planetName = child.name;
            }
          });
          (child as any).planetName = child.name;
        }
      });
      
      // Also hide the outermost orbit ring (for Pluto)
      scene.traverse((child) => {
        // Find orbit rings - they are usually Object_XX meshes at the outer edge
        if (child.name === 'Object_52' || child.name === 'Object_54') {
          // These might be Pluto's orbit rings - check by hiding
          child.visible = false;
        }
      });
      
      setPlanetMeshes(meshes);
      console.log('🪐 Planet meshes ready for hover detection:', meshes.length);
    }
  }, [scene]);

  // Hover detection
  useFrame(() => {
    if (planetMeshes.length === 0) return;
    
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(planetMeshes, true);
    
    if (intersects.length > 0) {
      const hit = intersects[0];
      let planetName = (hit.object as any).planetName;
      
      // Walk up the parent chain to find the planet name
      if (!planetName) {
        let parent = hit.object.parent;
        while (parent && !planetName) {
          planetName = (parent as any).planetName;
          parent = parent.parent;
        }
      }
      
      if (planetName && planetNames[planetName]) {
        const worldPos = new THREE.Vector3();
        hit.object.getWorldPosition(worldPos);
        onHover(worldPos, planetName);
      }
    } else {
      onHoverEnd();
    }
  });

  // Auto-rotate the model
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={1.5}
        position={[0, 0, 0]}
      />
    </group>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
      <p className="text-amber-600 font-medium text-lg">Loading Solar System...</p>
      <p className="text-stone-500 text-sm mt-1">Please wait while the 3D model loads</p>
    </div>
  </Html>
);

// Camera setup component to set initial view
const CameraSetup = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Set initial camera position for elevated angled view
    // Position: right side, elevated, looking down and left (so sun appears on left, planets extend right)
    camera.position.set(-25, 22, 35);
    // Make camera look at the center of the solar system
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};

// Scene content with hover state management
const SceneContent = ({ autoRotate }: { autoRotate: boolean }) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<{
    position: THREE.Vector3;
    name: string;
  } | null>(null);

  const handleHover = (position: THREE.Vector3, planetName: string) => {
    setHoveredPlanet({ position, name: planetName });
  };

  const handleHoverEnd = () => {
    setHoveredPlanet(null);
  };

  return (
    <>
      {/* Camera Setup */}
      <CameraSetup />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <hemisphereLight intensity={0.5} groundColor="#000000" />

      {/* Stars Background */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />

      {/* Solar System Model */}
      <Suspense fallback={<LoadingSpinner />}>
        <SolarSystemModel 
          autoRotate={autoRotate} 
          onHover={handleHover}
          onHoverEnd={handleHoverEnd}
        />
      </Suspense>

      {/* Planet Tooltip */}
      {hoveredPlanet && (
        <PlanetTooltip 
          position={hoveredPlanet.position}
          planetInfo={planetNames[hoveredPlanet.name]}
          visible={true}
        />
      )}

      {/* Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={200}
        autoRotate={false}
        makeDefault
        target={[0, 0, 0]}
      />
    </>
  );
};

interface SolarSystemSimulatorProps {
  className?: string;
}

const SolarSystemSimulator: React.FC<SolarSystemSimulatorProps> = ({ className = '' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false); // Start with auto-rotate off for stable default view
  const [showInfo, setShowInfo] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Preload the GLB model
  useGLTF.preload('/simulators/solar_system/solar_system_animation.glb');

  const SimulatorContent = () => (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-black rounded-lg overflow-hidden">
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-300 ${
            autoRotate 
              ? 'bg-amber-500/80 text-white hover:bg-amber-600/80' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          title={autoRotate ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
        >
          <RotateCcw size={20} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
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
          <Info size={20} />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-all duration-300"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-16 right-4 z-10 w-72 bg-black/70 backdrop-blur-md rounded-lg p-4 text-white border border-white/20">
          <h4 className="font-bold text-amber-400 mb-2">🌌 Our Solar System</h4>
          <ul className="text-sm space-y-1 text-gray-200">
            <li>☀️ The Sun is at the center</li>
            <li>🪐 8 planets orbit the Sun</li>
            <li>🌍 Earth is the 3rd planet from the Sun</li>
            <li>🔴 Mars is called the Red Planet</li>
            <li>💫 Saturn has beautiful rings</li>
          </ul>
          <p className="text-xs text-gray-400 mt-3">
            <strong>Tip:</strong> Hover over planets to see their names!
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
        <span className="text-amber-400">🖱️ Hover</span> for planet names • <span className="text-amber-400">Drag</span> to rotate • <span className="text-amber-400">Scroll</span> to zoom
      </div>

      {/* 3D Canvas - Camera positioned for elevated angled view with sun on left, planets extending right */}
      <Canvas
        camera={{ position: [-25, 22, 35], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <SceneContent autoRotate={autoRotate} />
      </Canvas>
    </div>
  );

  return (
    <>
      {/* Regular View */}
      <div className={`${className}`}>
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">🌌 Solar System Visualization</h3>
          <p className="text-gray-600">Explore our solar system in interactive 3D - hover over planets to learn more!</p>
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

export default SolarSystemSimulator;
