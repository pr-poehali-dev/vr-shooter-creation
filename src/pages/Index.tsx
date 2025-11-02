import { useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Sky, Text } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import VRHand from '@/components/VRHand';
import PhysicalObject from '@/components/PhysicalObject';
import GManGlass from '@/components/GManGlass';
import { useRef } from 'react';
import * as THREE from 'three';

function InventorySlot({ position, label, item }: { position: [number, number, number]; label: string; item?: string }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial
          color={item ? '#0EA5E9' : '#1A1F2C'}
          metalness={0.7}
          roughness={0.3}
          emissive={item ? '#0EA5E9' : '#000000'}
          emissiveIntensity={item ? 0.2 : 0}
        />
      </mesh>
      
      <Text
        position={[0, -0.25, 0.06]}
        fontSize={0.08}
        color="#8E9196"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      
      {item && (
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.06}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {item}
        </Text>
      )}
    </group>
  );
}

function PlayerBody() {
  return (
    <group position={[0, 0, -2]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.4]} />
        <meshStandardMaterial color="#1A1F2C" metalness={0.4} roughness={0.6} />
      </mesh>

      <InventorySlot position={[-0.3, 0.8, 0.25]} label="Грудь Л" />
      <InventorySlot position={[0.3, 0.8, 0.25]} label="Грудь П" />
      <InventorySlot position={[-0.5, 0, 0.25]} label="Бедро Л" item="🔫" />
      <InventorySlot position={[0.5, 0, 0.25]} label="Бедро П" item="💊" />
      <InventorySlot position={[0, 1.2, -0.15]} label="Спина" />
    </group>
  );
}

function GameEnvironment({ level, onBreakGlass }: { level: number; onBreakGlass: () => void }) {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#0EA5E9" />

      <RigidBody type="fixed" position={[0, -1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[50, 0.5, 50]} />
          <meshStandardMaterial color="#0f1419" metalness={0.8} roughness={0.2} />
        </mesh>
      </RigidBody>

      <group ref={gridRef} position={[0, -0.7, 0]}>
        {[...Array(20)].map((_, i) => (
          <mesh key={`grid-x-${i}`} position={[(i - 10) * 2, 0, 0]}>
            <boxGeometry args={[0.05, 0.05, 40]} />
            <meshBasicMaterial color="#0EA5E9" transparent opacity={0.2} />
          </mesh>
        ))}
        {[...Array(20)].map((_, i) => (
          <mesh key={`grid-z-${i}`} position={[0, 0, (i - 10) * 2]}>
            <boxGeometry args={[40, 0.05, 0.05]} />
            <meshBasicMaterial color="#0EA5E9" transparent opacity={0.2} />
          </mesh>
        ))}
      </group>

      <RigidBody type="fixed" position={[-5, 1, 5]}>
        <mesh castShadow>
          <boxGeometry args={[2, 3, 0.5]} />
          <meshStandardMaterial color="#1A1F2C" metalness={0.5} roughness={0.5} />
        </mesh>
      </RigidBody>

      <PhysicalObject position={[-2, 2, 3]} type="box" color="#1A1F2C" />
      <PhysicalObject position={[2, 3, 2]} type="sphere" color="#0EA5E9" scale={0.8} />
      <PhysicalObject position={[0, 2.5, 4]} type="cylinder" color="#8E9196" scale={0.7} />
      <PhysicalObject position={[-3, 1.5, 1]} type="box" color="#1A1F2C" scale={0.6} />
      <PhysicalObject position={[3, 1.8, 3]} type="sphere" color="#0EA5E9" scale={0.5} />

      {level >= 5 && (
        <GManGlass position={[0, 2, 10]} onBreak={onBreakGlass} />
      )}

      <Text
        position={[0, 4, 8]}
        fontSize={0.5}
        color="#0EA5E9"
        anchorX="center"
        anchorY="middle"
      >
        {level < 5 ? `УРОВЕНЬ ${level}/5` : 'ФИНАЛЬНЫЙ УРОВЕНЬ'}
      </Text>
    </>
  );
}

export default function Index() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(30);
  const [score, setScore] = useState(0);

  const handleShoot = () => {
    if (ammo > 0) {
      setAmmo(ammo - 1);
      setScore(score + 10);
      if ((score + 10) % 100 === 0 && level < 5) {
        setLevel(level + 1);
      }
    }
  };

  if (showCredits) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1419] to-[#1A1F2C] text-white flex items-center justify-center p-8">
        <div className="max-w-2xl text-center space-y-6 animate-fade-in">
          <h1 className="text-6xl font-bold mb-8">МИССИЯ ЗАВЕРШЕНА</h1>
          <div className="space-y-4 text-2xl">
            <p className="text-[#0EA5E9] font-bold">G-Man нанял вас в свою команду</p>
            <p className="text-[#8E9196] mt-8">Добро пожаловать в реальность</p>
          </div>
          <div className="mt-16 space-y-3 text-lg text-[#8E9196]">
            <p className="text-xl font-bold text-white mb-4">ТИТРЫ</p>
            <p>Движок: Three.js + React Three Fiber</p>
            <p>Физика: Rapier Physics Engine</p>
            <p>Разработчик: Юра AI</p>
            <p>Платформа: poehali.dev</p>
            <p className="mt-8 text-sm">Спасибо за игру!</p>
          </div>
          <Button 
            onClick={() => {
              setShowCredits(false);
              setGameStarted(false);
              setLevel(1);
              setScore(0);
              setHealth(100);
              setAmmo(30);
            }}
            className="mt-12 text-lg px-8 py-6"
            size="lg"
          >
            Вернуться в меню
          </Button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1419] to-[#1A1F2C] text-white flex items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-8 animate-scale-in">
          <div className="text-center space-y-4">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent">
              3D VR ШУТЕР
            </h1>
            <p className="text-2xl text-[#8E9196]">Powered by Three.js</p>
            <p className="text-lg text-[#0EA5E9]">Inspired by Half-Life: Alyx</p>
          </div>

          <Card className="bg-[#1A1F2C]/50 border-[#0EA5E9]/30 p-8">
            <h2 className="text-3xl font-bold mb-6 text-[#0EA5E9]">
              <Icon name="Gamepad2" className="inline mr-3" size={32} />
              Особенности
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <Icon name="Hand" className="text-[#0EA5E9] mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold">Гравитационные перчатки</h3>
                    <p className="text-[#8E9196]">Притягивайте объекты силой мысли</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <Icon name="Package" className="text-[#0EA5E9] mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold">Физический инвентарь</h3>
                    <p className="text-[#8E9196]">5 слотов на теле персонажа</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <Icon name="Sparkles" className="text-[#0EA5E9] mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold">Реалистичная физика</h3>
                    <p className="text-[#8E9196]">Rapier Physics Engine</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <Icon name="Target" className="text-[#0EA5E9] mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold">Сюжетная кампания</h3>
                    <p className="text-[#8E9196]">Встретьте G-Man на 5 уровне</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => setGameStarted(true)}
              className="text-xl px-12 py-8 bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] hover:opacity-90"
            >
              <Icon name="Play" className="mr-3" size={24} />
              Запустить VR режим
            </Button>
          </div>

          <div className="text-center space-y-2 text-[#8E9196]">
            <p>🖱️ Управление камерой: Зажмите ЛКМ и перемещайте мышь</p>
            <p>🔫 Стрельба: Кнопка "Выстрел"</p>
            <p>🧤 Гравитационные перчатки: Кликните на объект чтобы притянуть</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0f1419] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1A1F2C]/80 backdrop-blur-md rounded-lg border border-[#0EA5E9]/30 p-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex gap-6 items-center flex-wrap">
                <Badge variant="outline" className="text-lg px-4 py-2 border-[#0EA5E9]">
                  <Icon name="Layers" className="mr-2" size={18} />
                  Уровень {level}/5
                </Badge>
                
                <div className="flex items-center gap-2">
                  <Icon name="Heart" className="text-red-500" size={20} />
                  <div className="w-32 h-3 bg-[#0f1419] rounded-full overflow-hidden border border-[#8E9196]/30">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
                      style={{ width: `${health}%` }}
                    />
                  </div>
                  <span className="text-white text-sm font-mono">{health}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon name="Crosshair" className="text-[#0EA5E9]" size={20} />
                  <span className="text-white font-mono text-lg">{ammo}/30</span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon name="Trophy" className="text-yellow-500" size={20} />
                  <span className="text-white font-mono">{score}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleShoot}
                  disabled={ammo === 0}
                  className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80"
                >
                  <Icon name="Crosshair" className="mr-2" size={16} />
                  Выстрел
                </Button>
                
                <Button 
                  onClick={() => setAmmo(30)}
                  variant="outline"
                >
                  <Icon name="RotateCw" className="mr-2" size={16} />
                  Reload
                </Button>

                <Button 
                  onClick={() => setGameStarted(false)}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="Menu" className="mr-2" size={16} />
                  Меню
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Canvas shadows className="w-full h-full">
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <PerspectiveCamera makeDefault position={[0, 2, 5]} />
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxPolarAngle={Math.PI / 2}
              minDistance={2}
              maxDistance={20}
            />
            
            <GameEnvironment level={level} onBreakGlass={() => setShowCredits(true)} />
            
            <VRHand position={[-1, 1.5, 1]} isRight={false} />
            <VRHand position={[1, 1.5, 1]} isRight={true} />
            
            <PlayerBody />

            <Environment preset="night" />
          </Physics>
        </Suspense>
      </Canvas>

      {level >= 5 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-yellow-500/20 backdrop-blur-md px-6 py-4 rounded-lg border-2 border-yellow-500 animate-pulse">
            <p className="text-yellow-200 font-bold text-lg flex items-center gap-2">
              <Icon name="AlertTriangle" size={24} />
              G-MAN ОБНАРУЖЕН! Кликните на стекло 3 раза!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
