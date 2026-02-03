import React, { useState, useRef, Suspense, Component, ReactNode, ErrorInfo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Mesh, Group } from 'three';
import { Info, RotateCw, Maximize2, X } from 'lucide-react';

// Error Boundary Component
class CanvasErrorBoundary extends Component<{
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode; onError?: (error: Error, errorInfo: ErrorInfo) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Canvas Error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface ChloroplastPart {
  id: string;
  name: string;
  description: string;
  color: string;
}

const chloroplastParts: ChloroplastPart[] = [
  {
    id: 'outer-membrane',
    name: 'Outer Membrane',
    description: 'The outer boundary of the chloroplast, composed of a phospholipid bilayer that regulates the entry and exit of molecules.',
    color: '#4A7C2A' // Vibrant green
  },
  {
    id: 'inner-membrane',
    name: 'Inner Membrane',
    description: 'The inner boundary that surrounds the stroma. It contains transport proteins and helps maintain the internal environment.',
    color: '#5A8C3F' // Bright green
  },
  {
    id: 'stroma',
    name: 'Stroma',
    description: 'The fluid-filled space inside the chloroplast where the Calvin cycle occurs. Contains enzymes, DNA, and ribosomes.',
    color: '#6A9C4A' // Light vibrant green fluid
  },
  {
    id: 'thylakoid',
    name: 'Thylakoid',
    description: 'Flattened, disc-like structures that contain chlorophyll. Site of the light-dependent reactions of photosynthesis.',
    color: '#4CAF50' // Rich vibrant green (chlorophyll color)
  },
  {
    id: 'granum',
    name: 'Grana (Granum)',
    description: 'Stacks of thylakoids that increase the surface area for light absorption and maximize photosynthetic efficiency.',
    color: '#2E7D32' // Deep vibrant green
  },
  {
    id: 'lamella',
    name: 'Stroma Lamellae',
    description: 'Connecting membranes between grana that help maintain the structure and facilitate the transport of materials.',
    color: '#66BB6A' // Bright medium green
  },
  {
    id: 'dna',
    name: 'Chloroplast DNA',
    description: 'Circular DNA molecules that contain genes essential for chloroplast function and protein synthesis.',
    color: '#E91E63' // Bright pink/magenta for DNA (distinctive and colorful)
  },
  {
    id: 'ribosome',
    name: 'Ribosomes',
    description: 'Small structures responsible for protein synthesis within the chloroplast.',
    color: '#FF9800' // Bright orange for ribosomes
  }
];

// 3D Components - Enhanced for realism
const OuterMembrane: React.FC<{ onPartClick: (part: ChloroplastPart) => void }> = ({ onPartClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Subtle animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      onClick={() => onPartClick(chloroplastParts[0])}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
      scale={[1.5, 1.2, 1.3]} // More ellipsoid shape (lens-like)
    >
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshStandardMaterial
        color="#4A7C2A"
        transparent
        opacity={0.4}
        side="double"
        metalness={0.2}
        roughness={0.8}
        emissive="#5A9C3A"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const InnerMembrane: React.FC<{ onPartClick: (part: ChloroplastPart) => void }> = ({ onPartClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.03;
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      onClick={() => onPartClick(chloroplastParts[1])}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
      scale={[1.4, 1.15, 1.25]} // Ellipsoid to match outer membrane
    >
      <sphereGeometry args={[2.3, 32, 32]} />
      <meshStandardMaterial
        color="#5A8C3F"
        transparent
        opacity={0.5}
        side="double"
        metalness={0.2}
        roughness={0.75}
        emissive="#6A9C4F"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
};

const Stroma: React.FC<{ onPartClick: (part: ChloroplastPart) => void }> = ({ onPartClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Subtle pulsing to simulate fluid movement
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      meshRef.current.scale.set(1.3 * pulse, 1.15 * pulse, 1.2 * pulse);
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      onClick={() => onPartClick(chloroplastParts[2])}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
      scale={[1.3, 1.15, 1.2]}
    >
      <sphereGeometry args={[2.1, 32, 32]} />
      <meshStandardMaterial
        color="#6A9C4A"
        transparent
        opacity={0.3}
        side="double"
        metalness={0.1}
        roughness={0.9}
        emissive="#7AAC5A"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

const Thylakoid: React.FC<{ 
  position: [number, number, number];
  rotation: [number, number, number];
  onPartClick: (part: ChloroplastPart) => void;
  index?: number;
}> = ({ position, rotation, onPartClick, index = 0 }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Subtle glow animation
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as any;
      const glow = 0.2 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
      material.emissiveIntensity = glow;
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={() => onPartClick(chloroplastParts[3])}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Flattened disc shape - more realistic thylakoid */}
      <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
      <meshStandardMaterial
        color="#4CAF50"
        metalness={0.3}
        roughness={0.5}
        emissive="#66BB6A"
        emissiveIntensity={0.4}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
};

const Granum: React.FC<{ 
  position: [number, number, number];
  onPartClick: (part: ChloroplastPart) => void;
  rotation?: [number, number, number];
}> = ({ position, onPartClick, rotation = [0, 0, 0] }) => {
  const groupRef = useRef<Group>(null);
  
  // Create a more realistic stack of thylakoids (granum)
  // Thylakoids are very thin discs stacked closely together
  const thylakoidCount = 10 + Math.floor(Math.random() * 5); // 10-15 thylakoids per granum
  const thylakoids = [];
  const spacing = 0.06; // Very close spacing (realistic)
  
  for (let i = 0; i < thylakoidCount; i++) {
    // Slight variation in size for realism
    const sizeVariation = 1 + (Math.random() - 0.5) * 0.1;
    thylakoids.push(
      <Thylakoid
        key={i}
        position={[0, (i - thylakoidCount / 2) * spacing, 0]}
        rotation={[Math.PI / 2, rotation[1], rotation[2]]}
        onPartClick={onPartClick}
        index={i}
      />
    );
  }
  
  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={() => onPartClick(chloroplastParts[4])}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {thylakoids}
    </group>
  );
};

const StromaLamella: React.FC<{ 
  position: [number, number, number];
  rotation: [number, number, number];
  onPartClick: (part: ChloroplastPart) => void;
}> = ({ position, rotation, onPartClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={() => onPartClick(chloroplastParts[5])}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Flattened tube connecting grana */}
      <cylinderGeometry args={[0.08, 0.08, 1.0, 16]} />
      <meshStandardMaterial
        color="#66BB6A"
        transparent
        opacity={0.8}
        metalness={0.25}
        roughness={0.6}
        emissive="#81C784"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
};

const ChloroplastDNA: React.FC<{ 
  position: [number, number, number];
  onPartClick: (part: ChloroplastPart) => void;
}> = ({ position, onPartClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Slow rotation to simulate circular DNA
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={() => onPartClick(chloroplastParts[6])}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Circular DNA - torus shape */}
      <torusGeometry args={[0.12, 0.03, 12, 24]} />
      <meshStandardMaterial
        color="#E91E63"
        emissive="#F06292"
        emissiveIntensity={0.6}
        metalness={0.4}
        roughness={0.4}
      />
    </mesh>
  );
};

const Ribosome: React.FC<{ 
  position: [number, number, number];
  onPartClick: (part: ChloroplastPart) => void;
}> = ({ position, onPartClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Subtle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.05;
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={() => onPartClick(chloroplastParts[7])}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Ribosome - small spherical structure */}
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial
        color="#FF9800"
        emissive="#FFB74D"
        emissiveIntensity={0.5}
        metalness={0.5}
        roughness={0.4}
      />
    </mesh>
  );
};

const ChloroplastModel: React.FC<{ onPartClick: (part: ChloroplastPart) => void }> = ({ onPartClick }) => {
  // Create multiple grana at different positions with varied rotations for realism
  const granaPositions: Array<{ pos: [number, number, number]; rot: [number, number, number] }> = [
    { pos: [0.6, 0.4, 0.3], rot: [0, Math.PI / 6, Math.PI / 8] },
    { pos: [-0.5, 0.3, 0.4], rot: [0, -Math.PI / 5, Math.PI / 7] },
    { pos: [0.4, -0.4, -0.3], rot: [0, Math.PI / 4, -Math.PI / 6] },
    { pos: [-0.6, -0.3, -0.4], rot: [0, -Math.PI / 3, Math.PI / 5] },
    { pos: [0, 0.6, 0.2], rot: [0, 0, Math.PI / 4] },
    { pos: [0.2, -0.5, 0.1], rot: [0, Math.PI / 3, -Math.PI / 4] },
    { pos: [-0.3, 0.2, -0.5], rot: [0, -Math.PI / 4, Math.PI / 6] }
  ];
  
  // Create stroma lamellae connecting grana (more realistic connections)
  const lamellaePositions: Array<{ pos: [number, number, number]; rot: [number, number, number] }> = [
    { pos: [0.35, 0.35, 0.35], rot: [0, Math.PI / 4, Math.PI / 6] },
    { pos: [-0.25, 0.15, 0.35], rot: [0, -Math.PI / 4, Math.PI / 5] },
    { pos: [0.2, -0.2, -0.25], rot: [0, Math.PI / 3, -Math.PI / 4] },
    { pos: [-0.3, -0.15, -0.2], rot: [0, -Math.PI / 3, Math.PI / 6] },
    { pos: [0.1, 0.5, 0.1], rot: [0, Math.PI / 5, Math.PI / 4] },
    { pos: [0.15, -0.45, 0.05], rot: [0, Math.PI / 4, -Math.PI / 3] }
  ];
  
  // DNA positions (scattered in stroma)
  const dnaPositions: [number, number, number][] = [
    [0.7, 0.1, 0.2],
    [-0.7, -0.1, -0.2],
    [0.3, 0.5, -0.3]
  ];
  
  // Ribosome positions (more scattered in stroma for realism)
  const ribosomePositions: [number, number, number][] = [
    [0.5, 0.3, 0.2], [-0.5, 0.25, 0.3],
    [0.35, -0.35, -0.15], [-0.4, -0.25, -0.25],
    [0.15, 0.55, 0.1], [-0.2, -0.5, -0.1],
    [0.6, -0.2, 0.3], [-0.55, 0.4, -0.2],
    [0.25, 0.1, 0.5], [-0.3, -0.15, -0.4]
  ];
  
  return (
    <group>
      {/* Outer Membrane */}
      <OuterMembrane onPartClick={onPartClick} />
      
      {/* Inner Membrane */}
      <InnerMembrane onPartClick={onPartClick} />
      
      {/* Stroma */}
      <Stroma onPartClick={onPartClick} />
      
      {/* Grana (stacks of thylakoids) - more realistic distribution */}
      {granaPositions.map((granum, idx) => (
        <Granum 
          key={`granum-${idx}`} 
          position={granum.pos} 
          rotation={granum.rot}
          onPartClick={onPartClick} 
        />
      ))}
      
      {/* Stroma Lamellae - connecting grana */}
      {lamellaePositions.map((lamella, idx) => (
        <StromaLamella
          key={`lamella-${idx}`}
          position={lamella.pos}
          rotation={lamella.rot}
          onPartClick={onPartClick}
        />
      ))}
      
      {/* Chloroplast DNA */}
      {dnaPositions.map((pos, idx) => (
        <ChloroplastDNA key={`dna-${idx}`} position={pos} onPartClick={onPartClick} />
      ))}
      
      {/* Ribosomes - scattered throughout stroma */}
      {ribosomePositions.map((pos, idx) => (
        <Ribosome key={`ribosome-${idx}`} position={pos} onPartClick={onPartClick} />
      ))}
      
      {/* Enhanced lighting for vibrant, realistic appearance */}
      <ambientLight intensity={1.2} color="#E8F5E9" /> {/* Bright green-tinted ambient */}
      <pointLight position={[5, 5, 5]} intensity={2.0} color="#C8E6C9" /> {/* Bright green-tinted light */}
      <pointLight position={[-5, -5, -5]} intensity={1.2} color="#A5D6A7" />
      <pointLight position={[0, 8, 0]} intensity={1.5} color="#E8F5E9" />
      <directionalLight position={[0, 5, 0]} intensity={1.5} color="#FFFFFF" />
      <directionalLight position={[3, -3, 3]} intensity={0.8} color="#C8E6C9" />
      <directionalLight position={[-3, 3, -3]} intensity={0.8} color="#A5D6A7" />
    </group>
  );
};

const ChloroplastSimulator: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<ChloroplastPart | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isThreeReady, setIsThreeReady] = useState(false);
  const controlsRef = useRef<{ reset: () => void } | null>(null);
  
  // Only render on client side to avoid SSR issues
  useEffect(() => {
    setIsClient(true);
    // Ensure Three.js is loaded
    if (typeof window !== 'undefined') {
      import('three').then(() => {
        setIsThreeReady(true);
      }).catch((err) => {
        console.error('Failed to load Three.js:', err);
        setHasError(true);
      });
    }
  }, []);
  
  const handlePartClick = (part: ChloroplastPart) => {
    setSelectedPart(part);
  };
  
  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Don't render until client-side and Three.js is ready
  if (!isClient || !isThreeReady) {
    return (
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-green-200/50">
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing 3D simulator...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error fallback UI
  if (hasError) {
    return (
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-green-200/50">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Load 3D Simulator</h3>
          <p className="text-gray-600 text-sm mb-4">
            There was an error loading the 3D chloroplast simulator. This might be due to browser compatibility.
          </p>
          <button
            onClick={() => setHasError(false)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div className={`bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-green-200/50 ${isFullscreen ? 'h-full rounded-none' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              3D Chloroplast Simulator
            </h3>
            <p className="text-sm text-gray-600">
              Click on any part to learn more. Use mouse to rotate, scroll to zoom.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetView}
              className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
              title="Reset View"
            >
              <RotateCw size={16} />
              Reset
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <X size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
        
        {/* 3D Canvas */}
        <div className={`bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 rounded-xl shadow-2xl overflow-hidden ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[600px]'}`}>
          <CanvasErrorBoundary
            fallback={
              <div className="h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="mb-4">Error loading 3D model</p>
                  <button
                    onClick={() => setHasError(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Show Fallback
                  </button>
                </div>
              </div>
            }
            onError={() => setHasError(true)}
          >
            <Suspense
              fallback={
                <div className="h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading 3D model...</p>
                  </div>
                </div>
              }
            >
              <Canvas
                camera={{ position: [0, 0, 6], fov: 50 }}
                gl={{ antialias: true, alpha: false }}
              >
                <ChloroplastModel onPartClick={handlePartClick} />
                <OrbitControls
                  ref={(controls) => {
                    if (controls) {
                      controlsRef.current = { reset: () => {
                        controls.reset();
                      }};
                    }
                  }}
                  enableDamping
                  dampingFactor={0.05}
                  minDistance={3}
                  maxDistance={10}
                  autoRotate={false}
                  autoRotateSpeed={0.5}
                />
              </Canvas>
            </Suspense>
          </CanvasErrorBoundary>
        </div>
        
        {/* Part Information Panel */}
        {selectedPart && (
          <div className="mt-4 bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedPart.color }}
                  />
                  <h4 className="text-lg font-bold text-gray-800">{selectedPart.name}</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedPart.description}</p>
              </div>
              <button
                onClick={() => setSelectedPart(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
        
        {/* Parts Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {chloroplastParts.map((part) => (
            <button
              key={part.id}
              onClick={() => setSelectedPart(part)}
              className={`p-2 rounded-lg text-left transition-all duration-200 hover:scale-105 ${
                selectedPart?.id === part.id
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-white/60 hover:bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: part.color }}
                />
                <span className="text-xs font-medium text-gray-700">{part.name}</span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Instructions */}
        <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-semibold mb-1">Controls:</p>
              <ul className="space-y-1">
                <li>• Left click + drag: Rotate</li>
                <li>• Right click + drag: Pan</li>
                <li>• Scroll: Zoom in/out</li>
                <li>• Click parts: View information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChloroplastSimulator;

