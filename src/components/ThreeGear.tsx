import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

function GlowingRing() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const intensity = 1.5 + Math.sin(time * 2) * 0.5;
    (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.4, 0.05, 16, 100]} />
      <meshStandardMaterial color="#ef7d00" emissive="#ef7d00" emissiveIntensity={1.5} />
    </mesh>
  );
}

function LogoModel() {
  const meshRef = useRef<THREE.Group>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMouseMove = useRef(Date.now());
  const isIdle = useRef(true);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      lastMouseMove.current = Date.now();
      isIdle.current = false;
      
      const clientX = e instanceof MouseEvent ? e.clientX : (e.touches[0]?.clientX || 0);
      const clientY = e instanceof MouseEvent ? e.clientY : (e.touches[0]?.clientY || 0);
      
      mousePos.current = {
        x: (clientX / window.innerWidth) * 2 - 1,
        y: -((clientY / window.innerHeight) * 2 - 1)
      };
    };
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchstart', handleMove);
    window.addEventListener('touchmove', handleMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchstart', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const idleThreshold = 1000; // 1 second of no movement
    
    if (Date.now() - lastMouseMove.current > idleThreshold) {
      isIdle.current = true;
    }

    let targetX = mousePos.current.x;
    let targetY = mousePos.current.y;

    if (isIdle.current) {
      // Smooth circular random-ish movement when idle
      targetX = Math.sin(time * 0.5) * 0.4;
      targetY = Math.cos(time * 0.7) * 0.3;
    }
    
    const targetRotationY = targetX * 1.5; // Wider rotation
    const targetRotationX = -targetY * 1.0;
    const targetPositionX = targetX * 4.0; // Increased movement range
    const targetPositionY = targetY * 3.0;
    
    // Very snappy lerp factor
    const alpha = 0.2;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, alpha);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, alpha);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetPositionX, alpha);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetPositionY, alpha);
    
    // Smooth idle drift
    meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.1;
    meshRef.current.rotation.y += 0.008; // Base rotation
  });

  const shieldShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 5;
    const h = 6.5;
    
    // Top Serrated Edge
    const teeth = 20;
    const toothWidth = (w * 2) / teeth;
    shape.moveTo(-w, h/2);
    for (let i = 0; i <= teeth; i++) {
        const x = -w + (i * toothWidth);
        const y = h/2 + (i % 2 === 0 ? 0 : 0.4);
        shape.lineTo(x, y);
    }

    // Right Downward Slope
    shape.lineTo(w, h/2 - 1.5);
    // Tip
    shape.lineTo(0, -h/2 - 1);
    // Left Upward Slope
    shape.lineTo(-w, h/2 - 1.5);
    shape.closePath();
    
    // Main circular cutout for the center logo
    const holePath = new THREE.Path();
    holePath.absarc(0, 0.8, 2.3, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    return shape;
  }, []);

  return (
    <group ref={meshRef}>
      {/* Outer Black Shield */}
      <mesh position={[0, 0, -0.4]}>
        <extrudeGeometry args={[shieldShape, { depth: 0.8, bevelEnabled: true, bevelSize: 0.2, bevelThickness: 0.2 }]} />
        <meshStandardMaterial color="#000000" metalness={1} roughness={0.1} />
      </mesh>

      {/* Stepped Details Below (Lines) */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, -1.5 - (i * 0.6), 0.2]}>
            <boxGeometry args={[3.5 - (i * 0.8), 0.15, 0.3]} />
            <meshStandardMaterial color="#333" metalness={0.9} />
        </mesh>
      ))}
      
      {/* Center White Disc */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.4, 64]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Orange 'ZA' */}
      <group position={[0, 0.8, 0.4]}>
        {/* Z */}
        <group position={[-0.8, 0, 0]}>
            <mesh position={[0, 0.7, 0]}><boxGeometry args={[1.2, 0.35, 0.2]} /><meshStandardMaterial color="#ef7d00" /></mesh>
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 3.8]}><boxGeometry args={[1.9, 0.4, 0.2]} /><meshStandardMaterial color="#ef7d00" /></mesh>
            <mesh position={[0, -0.7, 0]}><boxGeometry args={[1.2, 0.35, 0.2]} /><meshStandardMaterial color="#ef7d00" /></mesh>
        </group>
        {/* A */}
        <group position={[0.9, 0, 0]}>
            <mesh position={[-0.45, 0, 0]} rotation={[0, 0, -0.25]}><boxGeometry args={[0.4, 1.8, 0.2]} /><meshStandardMaterial color="#ef7d00" /></mesh>
            <mesh position={[0.45, 0, 0]} rotation={[0, 0, 0.25]}><boxGeometry args={[0.4, 1.8, 0.2]} /><meshStandardMaterial color="#ef7d00" /></mesh>
            <mesh position={[0, -0.2, 0]}><boxGeometry args={[0.6, 0.3, 0.2]} /><meshStandardMaterial color="#ef7d00" /></mesh>
        </group>
      </group>

      {/* Glowing Outer Ring */}
      <GlowingRing />
    </group>
  );
}

export default function ThreeLogo() {
  return (
    <div className="w-full h-full">
      <Canvas 
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]} // Limit pixel ratio for better performance on high-res displays
      >
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ef7d00" />
        <pointLight position={[-10, -10, 10]} intensity={1} color="#ffffff" />
        
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <LogoModel />
        </Float>
        
        {/* Floor glow reflection - Simplified */}
        <mesh position={[0, -10, -5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial
                color="#0a0500"
                transparent
                opacity={0.5}
            />
        </mesh>
      </Canvas>
    </div>
  );
}
