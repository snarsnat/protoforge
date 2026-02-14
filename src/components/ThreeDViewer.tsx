import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Text } from '@react-three/drei';
import { GeneratedFile } from '../types';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';

interface ThreeDViewerProps {
  files: GeneratedFile[];
}

function GenericBox({ color = 0x3b82f6 }: { color?: number }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
    </Float>
  );
}

function RobotModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 1, 0.6]} />
          <meshStandardMaterial color={0x3b82f6} metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.5, 0.4, 0.4]} />
          <meshStandardMaterial color={0x64748b} metalness={0.5} roughness={0.2} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.12, 0.9, 0.21]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color={0x22c55e} emissive={0x22c55e} emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.12, 0.9, 0.21]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color={0x22c55e} emissive={0x22c55e} emissiveIntensity={2} />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.6, 0.1, 0]} rotation={[0, 0, Math.PI / 6]}>
          <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
          <meshStandardMaterial color={0x475569} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0.6, 0.1, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
          <meshStandardMaterial color={0x475569} metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Wheels */}
        <mesh position={[-0.35, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color={0x1e293b} />
        </mesh>
        <mesh position={[0.35, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color={0x1e293b} />
        </mesh>
      </group>
    </Float>
  );
}

function DroneModel() {
  const propRef1 = useRef<THREE.Mesh>(null);
  const propRef2 = useRef<THREE.Mesh>(null);
  const propRef3 = useRef<THREE.Mesh>(null);
  const propRef4 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const speed = 20;
    propRef1.current?.rotateZ(speed * delta);
    propRef2.current?.rotateZ(speed * delta);
    propRef3.current?.rotateZ(speed * delta);
    propRef4.current?.rotateZ(speed * delta);
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Body */}
        <mesh>
          <boxGeometry args={[0.3, 0.1, 0.4]} />
          <meshStandardMaterial color={0x1e293b} metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Arms */}
        {[[-0.4, 0], [0.4, 0], [0, -0.4], [0, 0.4]].map(([x, z], i) => (
          <mesh key={i} position={[x as number, 0, z as number]}>
            <boxGeometry args={[0.4, 0.03, 0.05]} />
            <meshStandardMaterial color={0x475569} />
          </mesh>
        ))}
        {/* Propellers */}
        {[[-0.5, 0.5], [0.5, 0.5], [-0.5, -0.5], [0.5, -0.5]].map(([x, z], i) => (
          <group key={i} position={[x as number, 0.05, z as number]}>
            <mesh ref={[propRef1, propRef2, propRef3, propRef4][i]}>
              <boxGeometry args={[0.3, 0.01, 0.03]} />
              <meshStandardMaterial color={0x64748b} transparent opacity={0.7} />
            </mesh>
            <mesh position={[0, -0.03, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
              <meshStandardMaterial color={0x3b82f6} />
            </mesh>
          </group>
        ))}
        {/* Camera */}
        <mesh position={[0, -0.08, 0.25]}>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial color={0x0f172a} metalness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

function PhoneModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group rotation={[0.3, 0, 0]}>
        {/* Body */}
        <mesh>
          <boxGeometry args={[0.5, 1, 0.03]} />
          <meshStandardMaterial color={0x0f172a} metalness={0.5} roughness={0.2} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[0.45, 0.9]} />
          <meshStandardMaterial color={0x1e293b} />
        </mesh>
        {/* Notch */}
        <mesh position={[0, 0.4, 0.016]}>
          <planeGeometry args={[0.15, 0.03]} />
          <meshStandardMaterial color={0x0f172a} />
        </mesh>
        {/* Camera */}
        <mesh position={[0.18, 0.4, 0.017]}>
          <sphereGeometry args={[0.015]} />
          <meshStandardMaterial color={0x1e293b} metalness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

function LaptopModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Base */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[1.5, 0.05, 1]} />
          <meshStandardMaterial color={0x64748b} metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.15, -0.45]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[1.5, 1, 0.03]} />
          <meshStandardMaterial color={0x475569} metalness={0.5} roughness={0.2} />
        </mesh>
        {/* Screen Display */}
        <mesh position={[0, 0.15, -0.435]} rotation={[-0.3, 0, 0]}>
          <planeGeometry args={[1.4, 0.9]} />
          <meshStandardMaterial color={0x1e293b} />
        </mesh>
        {/* Keyboard hint */}
        <mesh position={[0, -0.27, 0.1]}>
          <planeGeometry args={[1.2, 0.6]} />
          <meshStandardMaterial color={0x334155} />
        </mesh>
      </group>
    </Float>
  );
}

function SpeakerModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Cabinet */}
        <mesh>
          <boxGeometry args={[0.6, 1, 0.5]} />
          <meshStandardMaterial color={0x1e293b} metalness={0.2} roughness={0.6} />
        </mesh>
        {/* Woofer */}
        <mesh position={[0, -0.1, 0.26]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
          <meshStandardMaterial color={0x0f172a} />
        </mesh>
        {/* Tweeter */}
        <mesh position={[0, 0.3, 0.26]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
          <meshStandardMaterial color={0x0f172a} />
        </mesh>
        {/* Port */}
        <mesh position={[0.2, -0.35, 0.26]}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
          <meshStandardMaterial color={0x0f172a} />
        </mesh>
      </group>
    </Float>
  );
}

function WatchModel() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group rotation={[0.5, 0, 0]}>
        {/* Watch body */}
        <mesh>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 32]} />
          <meshStandardMaterial color={0x0f172a} metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.041, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.01, 32]} />
          <meshStandardMaterial color={0x1e293b} />
        </mesh>
        {/* Band top */}
        <mesh position={[0, 0.3, 0]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.03]} />
          <meshStandardMaterial color={0x475569} />
        </mesh>
        {/* Band bottom */}
        <mesh position={[0, -0.3, 0]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.03]} />
          <meshStandardMaterial color={0x475569} />
        </mesh>
      </group>
    </Float>
  );
}

function IoTDeviceModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Main body */}
        <mesh>
          <boxGeometry args={[0.6, 0.4, 0.2]} />
          <meshStandardMaterial color={0xf8fafc} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
          <meshStandardMaterial color={0x64748b} />
        </mesh>
        {/* LED indicators */}
        {[-0.15, 0, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0.21, 0]}>
            <sphereGeometry args={[0.02]} />
            <meshStandardMaterial 
              color={[0x22c55e, 0x0ea5e9, 0xef4444][i]} 
              emissive={[0x22c55e, 0x0ea5e9, 0xef4444][i]} 
              emissiveIntensity={2} 
            />
          </mesh>
        ))}
        {/* Buttons */}
        {[-0.1, 0.1].map((x, i) => (
          <mesh key={i} position={[x, -0.21, 0.05]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
            <meshStandardMaterial color={0x64748b} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function CarModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Body */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.2, 0.35, 0.5]} />
          <meshStandardMaterial color={0xef4444} metalness={0.5} roughness={0.2} />
        </mesh>
        {/* Cabin */}
        <mesh position={[0.1, 0.45, 0]}>
          <boxGeometry args={[0.6, 0.25, 0.45]} />
          <meshStandardMaterial color={0x64748b} metalness={0.6} roughness={0.1} />
        </mesh>
        {/* Wheels */}
        {[[-0.35, 0], [0.35, 0], [-0.35, -0.35], [0.35, -0.35]].map(([x, z], i) => (
          <mesh key={i} position={[x as number, 0.05, z as number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
            <meshStandardMaterial color={0x1e293b} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );
}

export function ThreeDViewer({ files }: ThreeDViewerProps) {
  const modelData = files.length > 0 ? JSON.parse(files[0].content) : null;
  const modelType = modelData?.type || 'generic';

  const renderModel = () => {
    switch (modelType) {
      case 'robot':
        return <RobotModel />;
      case 'drone':
        return <DroneModel />;
      case 'phone':
        return <PhoneModel />;
      case 'laptop':
        return <LaptopModel />;
      case 'speaker':
        return <SpeakerModel />;
      case 'watch':
        return <WatchModel />;
      case 'iot_device':
        return <IoTDeviceModel />;
      case 'car':
        return <CarModel />;
      default:
        return <GenericBox color={modelData?.parameters?.color || 0x3b82f6} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-dark-700">
        <h3 className="font-medium text-white text-sm">3D Model Viewer</h3>
        <p className="text-xs text-dark-400">Drag to rotate • Scroll to zoom</p>
      </div>
      <div className="flex-1 bg-dark-900">
        <Canvas>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[2, 1.5, 2]} />
            <OrbitControls 
              enablePan={false}
              minDistance={1}
              maxDistance={5}
            />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#0ea5e9" />
            {renderModel()}
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
