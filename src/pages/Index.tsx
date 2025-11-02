import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface InventorySlot {
  id: string;
  name: string;
  position: { x: number; y: number };
  item?: string;
}

interface HandPosition {
  x: number;
  y: number;
  grabbing: boolean;
}

export default function Index() {
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(30);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [leftHand, setLeftHand] = useState<HandPosition>({ x: 100, y: 300, grabbing: false });
  const [rightHand, setRightHand] = useState<HandPosition>({ x: 500, y: 300, grabbing: false });
  
  const [inventory, setInventory] = useState<InventorySlot[]>([
    { id: 'chest-1', name: 'Грудь Л', position: { x: 250, y: 150 } },
    { id: 'chest-2', name: 'Грудь П', position: { x: 350, y: 150 } },
    { id: 'hip-1', name: 'Бедро Л', position: { x: 220, y: 280 }, item: 'Пистолет' },
    { id: 'hip-2', name: 'Бедро П', position: { x: 380, y: 280 }, item: 'Аптечка' },
    { id: 'back', name: 'Спина', position: { x: 300, y: 100 } },
  ]);

  useEffect(() => {
    if (!gameStarted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawScene = () => {
      ctx.fillStyle = '#0f1419';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#0EA5E9';
      ctx.lineWidth = 2;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.globalAlpha = 0.1 + (i / canvas.width) * 0.2;
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + canvas.height / 2, canvas.height);
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#1A1F2C';
      ctx.fillRect(50, canvas.height - 150, 200, 100);
      ctx.strokeStyle = '#0EA5E9';
      ctx.strokeRect(50, canvas.height - 150, 200, 100);
      
      ctx.fillStyle = '#8E9196';
      ctx.font = '12px monospace';
      ctx.fillText('Физический объект', 60, canvas.height - 120);
      
      if (level >= 5) {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.3)';
        ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 100, 200, 200);
        ctx.strokeStyle = '#0EA5E9';
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width / 2 - 100, canvas.height / 2 - 100, 200, 200);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('G-MAN', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '12px monospace';
        ctx.fillText('[Разбить стекло]', canvas.width / 2, canvas.height / 2 + 20);
      }
      
      ctx.fillStyle = leftHand.grabbing ? '#0EA5E9' : '#8E9196';
      ctx.beginPath();
      ctx.arc(leftHand.x, leftHand.y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = rightHand.grabbing ? '#0EA5E9' : '#8E9196';
      ctx.beginPath();
      ctx.arc(rightHand.x, rightHand.y, 15, 0, Math.PI * 2);
      ctx.fill();
    };

    drawScene();
    const interval = setInterval(drawScene, 100);
    return () => clearInterval(interval);
  }, [gameStarted, leftHand, rightHand, level]);

  const handleShoot = () => {
    if (ammo > 0) {
      setAmmo(ammo - 1);
      setScore(score + 10);
      if (score > 0 && score % 100 === 0) {
        setLevel(level + 1);
      }
    }
  };

  const handleReload = () => {
    setAmmo(30);
  };

  const handleBreakGlass = () => {
    setShowCredits(true);
  };

  const startGame = () => {
    setGameStarted(true);
    setHealth(100);
    setAmmo(30);
    setScore(0);
    setLevel(1);
  };

  if (showCredits) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1419] to-[#1A1F2C] text-white flex items-center justify-center p-8">
        <div className="max-w-2xl text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">МИССИЯ ЗАВЕРШЕНА</h1>
          <div className="space-y-2 text-xl">
            <p className="text-[#0EA5E9]">G-Man нанял вас</p>
            <p className="text-[#8E9196] mt-8">Создано в poehali.dev</p>
          </div>
          <div className="mt-12 space-y-2 text-lg text-[#8E9196]">
            <p>Разработчик: Юра AI</p>
            <p>Движок: React + Canvas</p>
            <p>Спасибо за игру!</p>
          </div>
          <Button 
            onClick={() => {
              setShowCredits(false);
              setGameStarted(false);
            }}
            className="mt-8"
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
            <h1 className="text-6xl font-bold bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] bg-clip-text text-transparent">
              VR ШУТЕР
            </h1>
            <p className="text-xl text-[#8E9196]">Inspired by Half-Life: Alyx</p>
          </div>

          <Card className="bg-[#1A1F2C]/50 border-[#0EA5E9]/30 p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#0EA5E9]">
              <Icon name="Gamepad2" className="inline mr-2" />
              Особенности игры
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Icon name="Hand" className="text-[#0EA5E9] mt-1" size={20} />
                  <div>
                    <h3 className="font-bold">Физические руки</h3>
                    <p className="text-sm text-[#8E9196]">Реалистичное взаимодействие с объектами</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Icon name="Package" className="text-[#0EA5E9] mt-1" size={20} />
                  <div>
                    <h3 className="font-bold">Физический инвентарь</h3>
                    <p className="text-sm text-[#8E9196]">Слоты на груди, бедрах и спине</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Icon name="Zap" className="text-[#0EA5E9] mt-1" size={20} />
                  <div>
                    <h3 className="font-bold">Реалистичная физика</h3>
                    <p className="text-sm text-[#8E9196]">Детализированная система взаимодействий</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Icon name="Target" className="text-[#0EA5E9] mt-1" size={20} />
                  <div>
                    <h3 className="font-bold">Линейный сюжет</h3>
                    <p className="text-sm text-[#8E9196]">5 уровней до встречи с G-Man</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={startGame}
              className="text-lg px-8 py-6 bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] hover:opacity-90"
            >
              <Icon name="Play" className="mr-2" />
              Начать игру
            </Button>
          </div>

          <div className="text-center text-sm text-[#8E9196] space-y-2">
            <p>Управление: Левая/Правая рука - наведите курсор и кликните</p>
            <p>Инвентарь: Используйте слоты на теле персонажа для хранения предметов</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] text-white p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center bg-[#1A1F2C]/80 backdrop-blur p-4 rounded-lg border border-[#0EA5E9]/30">
          <div className="flex gap-6 items-center">
            <Badge variant="outline" className="text-lg px-4 py-2 border-[#0EA5E9]">
              <Icon name="Layers" className="mr-2" size={18} />
              Уровень {level}/5
            </Badge>
            
            <div className="flex items-center gap-2">
              <Icon name="Heart" className="text-red-500" size={20} />
              <div className="w-32 h-3 bg-[#1A1F2C] rounded-full overflow-hidden border border-[#8E9196]/30">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
                  style={{ width: `${health}%` }}
                />
              </div>
              <span className="text-sm font-mono">{health}%</span>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="Crosshair" className="text-[#0EA5E9]" size={20} />
              <span className="font-mono text-lg">{ammo}/30</span>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="Trophy" className="text-yellow-500" size={20} />
              <span className="font-mono">{score}</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setGameStarted(false)}
          >
            <Icon name="Menu" className="mr-2" size={16} />
            Меню
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Card className="bg-[#1A1F2C] border-[#0EA5E9]/30 p-0 overflow-hidden">
              <div className="relative">
                <canvas 
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full cursor-crosshair"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 800;
                    const y = ((e.clientY - rect.top) / rect.height) * 500;
                    
                    if (e.buttons === 1) {
                      setRightHand({ x, y, grabbing: true });
                    } else {
                      setRightHand({ x, y, grabbing: false });
                    }
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 800;
                    const y = ((e.clientY - rect.top) / rect.height) * 500;
                    
                    if (level >= 5 && 
                        x > 800/2 - 100 && x < 800/2 + 100 &&
                        y > 500/2 - 100 && y < 500/2 + 100) {
                      handleBreakGlass();
                    } else {
                      handleShoot();
                    }
                  }}
                />
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="bg-[#1A1F2C]/90 backdrop-blur px-4 py-2 rounded border border-[#0EA5E9]/50">
                    <p className="text-sm text-[#8E9196] font-mono">
                      Координаты: X:{Math.floor(rightHand.x)} Y:{Math.floor(rightHand.y)}
                    </p>
                  </div>
                  
                  {level >= 5 && (
                    <div className="bg-yellow-500/20 backdrop-blur px-4 py-2 rounded border border-yellow-500 animate-pulse">
                      <p className="text-sm text-yellow-200 font-bold">
                        <Icon name="AlertTriangle" className="inline mr-2" size={16} />
                        Обнаружен G-Man! Разбейте стекло!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-[#1A1F2C] border-[#0EA5E9]/30 p-4">
              <h3 className="font-bold text-[#0EA5E9] mb-4 flex items-center gap-2">
                <Icon name="Package" size={20} />
                Физический инвентарь
              </h3>
              
              <div className="relative h-80 bg-gradient-to-b from-[#0f1419] to-[#1A1F2C] rounded-lg border border-[#8E9196]/30 p-4">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <Icon name="User" size={200} className="text-[#0EA5E9]" />
                </div>
                
                {inventory.map((slot) => (
                  <div
                    key={slot.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${(slot.position.x / 600) * 100}%`, top: `${(slot.position.y / 400) * 100}%` }}
                  >
                    <div className="group relative">
                      <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all ${
                        slot.item 
                          ? 'bg-[#0EA5E9]/20 border-[#0EA5E9] hover:bg-[#0EA5E9]/30' 
                          : 'bg-[#1A1F2C] border-[#8E9196]/50 hover:border-[#8E9196]'
                      }`}>
                        {slot.item ? (
                          <span className="text-xs text-center">{slot.item}</span>
                        ) : (
                          <Icon name="Square" size={20} className="text-[#8E9196]" />
                        )}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-[#8E9196]">{slot.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-[#1A1F2C] border-[#0EA5E9]/30 p-4">
              <h3 className="font-bold text-[#0EA5E9] mb-3 flex items-center gap-2">
                <Icon name="Gamepad2" size={20} />
                Управление
              </h3>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/80"
                  onClick={handleShoot}
                  disabled={ammo === 0}
                >
                  <Icon name="Crosshair" className="mr-2" size={18} />
                  Выстрел ({ammo})
                </Button>
                
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={handleReload}
                >
                  <Icon name="RotateCw" className="mr-2" size={18} />
                  Перезарядка
                </Button>
                
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => setHealth(Math.min(100, health + 25))}
                >
                  <Icon name="Heart" className="mr-2" size={18} />
                  Использовать аптечку
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {level < 5 && (
          <Card className="bg-[#1A1F2C]/50 border-[#0EA5E9]/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Target" className="text-[#0EA5E9]" size={24} />
                <div>
                  <h3 className="font-bold">Цель миссии</h3>
                  <p className="text-sm text-[#8E9196]">
                    Пройдите все уровни, чтобы найти G-Man и завершить миссию
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#8E9196]">Прогресс</p>
                <p className="text-2xl font-bold text-[#0EA5E9]">{level}/5</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
