import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface GManGlassProps {
  position: [number, number, number];
  onBreak: () => void;
}

export default function GManGlass({ position, onBreak }: GManGlassProps) {
  const glassRef = useRef<THREE.Mesh>(null);
  const gmanRef = useRef<THREE.Group>(null);
  const [isBroken, setIsBroken] = useState(false);
  const [cracks, setCracks] = useState<number>(0);

  useFrame((state) => {
    if (!gmanRef.current || isBroken) return;
    
    gmanRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    gmanRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
  });

  const handleClick = () => {
    if (isBroken) return;
    
    setCracks(prev => prev + 1);
    
    if (cracks >= 2) {
      setIsBroken(true);
      onBreak();
    }
  };

  if (isBroken) {
    return (
      <group position={position}>
        {[...Array(20)].map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const radius = Math.random() * 2 + 1;
          const speed = Math.random() * 0.5 + 0.5;
          
          return (
            <RigidBody key={i} position={[
              Math.cos(angle) * radius,
              Math.random() * 2,
              Math.sin(angle) * radius
            ]}>
              <mesh>
                <boxGeometry args={[
                  Math.random() * 0.3 + 0.1,
                  Math.random() * 0.3 + 0.1,
                  0.05
                ]} />
                <meshStandardMaterial
                  color="#0EA5E9"
                  transparent
                  opacity={0.3}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            </RigidBody>
          );
        })}
        
        <group ref={gmanRef}>
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#1A1F2C" metalness={0.5} roughness={0.5} />
          </mesh>
          
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.8, 32]} />
            <meshStandardMaterial color="#0f1419" metalness={0.3} roughness={0.7} />
          </mesh>
          
          <mesh position={[-0.15, 0.1, 0.2]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={1} />
          </mesh>
          <mesh position={[0.15, 0.1, 0.2]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={1} />
          </mesh>

          <Text
            position={[0, 1, 0]}
            fontSize={0.3}
            color="#0EA5E9"
            anchorX="center"
            anchorY="middle"
          >
            G-MAN
          </Text>
        </group>
      </group>
    );
  }

  return (
    <group position={position}>
      <mesh
        ref={glassRef}
        onClick={handleClick}
        onPointerDown={handleClick}
      >
        <boxGeometry args={[3, 4, 0.2]} />
        <meshPhysicalMaterial
          color="#0EA5E9"
          transparent
          opacity={0.3}
          metalness={0.9}
          roughness={0.1}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>

      {cracks > 0 && [...Array(cracks * 3)].map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 2.5,
          (Math.random() - 0.5) * 3.5,
          0.15
        ]}>
          <planeGeometry args={[Math.random() * 0.5 + 0.2, 0.02]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      ))}

      <mesh position={[0, 0, -0.5]}>
        <boxGeometry args={[3.1, 4.1, 0.1]} />
        <meshStandardMaterial color="#1A1F2C" />
      </mesh>

      <group ref={gmanRef} position={[0, 0, -0.4]}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#1A1F2C" metalness={0.5} roughness={0.5} />
        </mesh>
        
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.8, 32]} />
          <meshStandardMaterial color="#0f1419" metalness={0.3} roughness={0.7} />
        </mesh>
        
        <mesh position={[-0.15, 0.1, 0.2]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.15, 0.1, 0.2]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={0.5} />
        </mesh>

        <Text
          position={[0, 1, 0]}
          fontSize={0.2}
          color="#8E9196"
          anchorX="center"
          anchorY="middle"
        >
          ???
        </Text>
      </group>

      <pointLight position={[0, 0, 0]} intensity={2} color="#0EA5E9" distance={5} />
    </group>
  );
}
