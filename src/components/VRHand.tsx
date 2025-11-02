import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface VRHandProps {
  position: [number, number, number];
  isRight?: boolean;
  onGrab?: (object: any) => void;
}

export default function VRHand({ position, isRight = true, onGrab }: VRHandProps) {
  const handRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [gloveActive, setGloveActive] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (gloveActive) {
      meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 5) * 0.1);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  const handlePointerDown = () => {
    setIsGrabbing(true);
    setGloveActive(true);
  };

  const handlePointerUp = () => {
    setIsGrabbing(false);
    setGloveActive(false);
  };

  return (
    <group position={position}>
      <RigidBody ref={handRef} type="kinematicPosition" colliders="ball">
        <mesh
          ref={meshRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={isGrabbing ? '#0EA5E9' : '#8E9196'}
            emissive={gloveActive ? '#0EA5E9' : '#000000'}
            emissiveIntensity={gloveActive ? 0.5 : 0}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {gloveActive && (
          <>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial
                color="#0EA5E9"
                transparent
                opacity={0.2}
                wireframe
              />
            </mesh>
            
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshBasicMaterial
                color="#0EA5E9"
                transparent
                opacity={0.1}
                side={THREE.BackSide}
              />
            </mesh>

            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const radius = 0.4;
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius,
                  ]}
                  rotation={[0, angle, 0]}
                >
                  <boxGeometry args={[0.02, 0.02, 0.2]} />
                  <meshBasicMaterial color="#0EA5E9" transparent opacity={0.6} />
                </mesh>
              );
            })}
          </>
        )}
      </RigidBody>
      
      <mesh position={[isRight ? 0.1 : -0.1, -0.3, 0]} rotation={[0, 0, isRight ? -0.3 : 0.3]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#1A1F2C" metalness={0.5} roughness={0.5} />
      </mesh>

      <mesh position={[isRight ? 0.15 : -0.15, -0.5, 0]} rotation={[0, 0, isRight ? -0.5 : 0.5]}>
        <boxGeometry args={[0.06, 0.15, 0.06]} />
        <meshStandardMaterial color="#1A1F2C" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}
