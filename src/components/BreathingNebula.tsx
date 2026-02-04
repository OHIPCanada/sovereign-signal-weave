import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

const NebulaCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Slow breathing distortion - very subtle
      materialRef.current.distort = 0.3 + Math.sin(clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2.4}>
        <icosahedronGeometry args={[1, 64]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#4A4680"
          transparent
          opacity={0.85}
          roughness={0.1}
          metalness={0.3}
          distort={0.35}
          speed={1.5}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Inner glow layer */}
      <mesh scale={2.2}>
        <icosahedronGeometry args={[1, 32]} />
        <meshBasicMaterial
          color="#6B5BA0"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer frosted glass shell */}
      <mesh scale={2.6}>
        <icosahedronGeometry args={[1, 32]} />
        <meshPhysicalMaterial
          color="#8080B0"
          transparent
          opacity={0.15}
          roughness={0.9}
          transmission={0.3}
          thickness={0.5}
          side={THREE.BackSide}
        />
      </mesh>
    </Float>
  );
};

const BreathingNebula = () => {
  return (
    <div className="w-full h-full" style={{ minHeight: "500px" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: "transparent" }}
      >
        {/* Soft ambient lighting */}
        <ambientLight intensity={0.6} />
        
        {/* Key light - subtle purple tint */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          color="#9090C0"
        />
        
        {/* Fill light - warmer for depth */}
        <directionalLight 
          position={[-5, -3, 3]} 
          intensity={0.4} 
          color="#C0A0A0"
        />
        
        {/* Rim light */}
        <pointLight 
          position={[0, 3, -3]} 
          intensity={0.5} 
          color="#A0B0D0"
        />

        <NebulaCore />
      </Canvas>
    </div>
  );
};

export default BreathingNebula;
