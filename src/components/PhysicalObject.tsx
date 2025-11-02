import { useRef, useState } from 'react';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PhysicalObjectProps {
  position: [number, number, number];
  type?: 'box' | 'sphere' | 'cylinder';
  color?: string;
  scale?: number;
}

export default function PhysicalObject({ 
  position, 
  type = 'box',
  color = '#1A1F2C',
  scale = 1 
}: PhysicalObjectProps) {
  const rbRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isGrabbed, setIsGrabbed] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (isHovered && !isGrabbed) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const renderGeometry = () => {
    switch (type) {
      case 'sphere':
        return <sphereGeometry args={[0.5 * scale, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.3 * scale, 0.3 * scale, 1 * scale, 32]} />;
      default:
        return <boxGeometry args={[1 * scale, 1 * scale, 1 * scale]} />;
    }
  };

  return (
    <RigidBody ref={rbRef} position={position} colliders="hull">
      <mesh
        ref={meshRef}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onPointerDown={() => setIsGrabbed(true)}
        onPointerUp={() => setIsGrabbed(false)}
        castShadow
        receiveShadow
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={isHovered ? '#0EA5E9' : color}
          metalness={0.6}
          roughness={0.4}
          emissive={isGrabbed ? '#0EA5E9' : '#000000'}
          emissiveIntensity={isGrabbed ? 0.3 : 0}
        />
      </mesh>
      
      {isHovered && (
        <mesh>
          <sphereGeometry args={[0.8 * scale, 16, 16]} />
          <meshBasicMaterial
            color="#0EA5E9"
            transparent
            opacity={0.1}
            wireframe
          />
        </mesh>
      )}
    </RigidBody>
  );
}
