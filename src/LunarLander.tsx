import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, useSphere, useBox } from '@react-three/cannon';
import { Stars, OrbitControls, Text, Sparkles, useGLTF, Center } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useControls } from 'leva';
import * as THREE from 'three';

// --- CONFIG ---
const USE_3D_MODELS = true; 

// --- Types ---
interface GameState {
  fuel: number;
  velocity: number;
  altitude: number;
  status: 'playing' | 'landed' | 'crashed';
}

// --- Components ---

// 1. Ay Küresi (Yeni Tam Gezegen Modeli ve Fizik HitBox'ı)
const MoonGlobe = () => {
  const { orbRadius, orbScale, orbRx, orbRy, orbRz, orbY } = useControls('Ay_Kuresi_HitBox', {
    orbRadius: { value: 100, min: 10, max: 2000, step: 1 },
    orbScale: { value: 5, min: 0.1, max: 200, step: 0.1 },
    orbRx: { value: 0, min: -180, max: 180, step: 1 },
    orbRy: { value: 0, min: -180, max: 180, step: 1 },
    orbRz: { value: 0, min: -180, max: 180, step: 1 },
    orbY: { value: -100, min: -2000, max: 100, step: 1 }
  });

  const [ref] = useSphere(() => ({
    type: 'Static',
    args: [orbRadius], 
    position: [0, orbY, 0],
  }), useRef(null), [orbRadius, orbY]);

  return (
    <group>
      <mesh ref={ref as any}>
        <sphereGeometry args={[orbRadius, 32, 32]} />
        <meshBasicMaterial color="#ff0000" wireframe={true} visible={true} transparent opacity={0.3} />
      </mesh>
      
      {USE_3D_MODELS ? (
        <Suspense fallback={null}>
          <GlobeModel position={[0, orbY, 0]} scale={orbScale} rotation={[orbRx, orbRy, orbRz]} />
        </Suspense>
      ) : (
        <mesh position={[0, orbY, 0]} receiveShadow>
          <sphereGeometry args={[orbRadius, 64, 64]} />
          <meshStandardMaterial color="#444" roughness={0.9} />
        </mesh>
      )}
    </group>
  );
};

// GLTF Globe (Ay Küresi) Modeli Yükleyici Bileşeni
const GlobeModel = ({ position, scale, rotation }: any) => {
  const { scene } = useGLTF('/moon_perfect_globe.glb') as any;
  return (
    <group 
      position={position} 
      rotation={[
        THREE.MathUtils.degToRad(rotation[0]), 
        THREE.MathUtils.degToRad(rotation[1]), 
        THREE.MathUtils.degToRad(rotation[2])
      ]}
    >
      {/* Center Modeli otomatik olarak sahnenizin ortasına (0,0,0 eksenine) zorla hizalar */}
      <Center>
        <primitive object={scene} scale={[scale, scale, scale]} />
      </Center>
    </group>
  );
};

const ApolloModel = () => {
  const { scene } = useGLTF('/spacecraft.glb') as any;
  const { shipRx, shipRy, shipRz, shipScale, shipYOffset } = useControls('Apollo_Gemisi', {
    shipRx: { value: 0, min: -180, max: 180, step: 1 },
    shipRy: { value: 0, min: -180, max: 180, step: 1 },
    shipRz: { value: 0, min: -180, max: 180, step: 1 },
    shipScale: { value: 0.5, min: 0.001, max: 10, step: 0.01 },
    shipYOffset: { value: -0.8, min: -5, max: 5, step: 0.1 }
  });

  return (
    <primitive 
      object={scene} 
      scale={[shipScale, shipScale, shipScale]} 
      position={[0, shipYOffset, 0]} 
      rotation={[
        THREE.MathUtils.degToRad(shipRx), 
        THREE.MathUtils.degToRad(shipRy), 
        THREE.MathUtils.degToRad(shipRz)
      ]} 
    />
  );
};

// 2. İniş İstasyonları (Kürenin tepesinde y=1.5'te yüzeyden hafif yukarda duran yapılar)
const LandingPad = ({ position, label }: { position: [number, number, number], label: string }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: [6, 1, 6], 
  }));

  return (
    <group ref={ref as any}>
      <mesh receiveShadow>
        <boxGeometry args={[6, 1, 6]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[0, 2, 0]} intensity={2} color="#00ff88" />
      <Text position={[0, 1.5, 0]} fontSize={0.6} color="white" anchorX="center" anchorY="middle" outlineWidth={0.05} outlineColor="black">
        {label}
      </Text>
    </group>
  );
};

// 3. Uzay Aracı
const Spacecraft = ({ onUpdate, onRestart }: { onUpdate: (state: GameState) => void; onRestart: () => void }) => {
  const { orbY, orbRadius } = useControls('Ay_Kuresi_HitBox', {
    orbY: { value: -100, min: -2000, max: 100, step: 1 },
    orbRadius: { value: 100, min: 10, max: 2000, step: 1 }
  });
  
  const [fuel, setFuel] = useState(100);
  const [status, setStatus] = useState<'playing' | 'landed' | 'crashed'>('playing');
  const [thrusting, setThrusting] = useState(false);
  
  const position = useRef([0, 0, 0]);
  const velocity = useRef([0, 0, 0]);
  const rotation = useRef([0, 0, 0, 1]);

  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 25, 0],
    args: [1, 1.5, 1], 
    linearDamping: 0.1,
    angularDamping: 0.5,
    angularFactor: [0, 0, 1], 
    linearFactor: [1, 1, 0],  
    onCollide: (e) => {
      if (status !== 'playing') return;

      const impactVelocity = Math.abs(e.contact.impactVelocity);
      
      const shipQuat = new THREE.Quaternion(rotation.current[0], rotation.current[1], rotation.current[2], rotation.current[3]);
      const shipUp = new THREE.Vector3(0, 1, 0).applyQuaternion(shipQuat);
      const normal = new THREE.Vector3(e.contact.contactNormal[0], e.contact.contactNormal[1], e.contact.contactNormal[2]);
      
      // Temas edilen yüzey normali ile geminin yukarı vektörü uyumlu mu? (Aya nereden inilirse inilsin güvenli inişi sağlar)
      const isUpright = shipUp.dot(normal) > 0.6; // Yaklaşık 53 derece tolerans
      
      if (impactVelocity > 6) {
        setStatus('crashed');
      } 
      else if (isUpright) {
        setStatus('landed');
      } 
      else {
        setStatus('crashed'); 
      }
    },
  }));

  useEffect(() => {
    const unsubscribeVel = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubscribePos = api.position.subscribe((p) => (position.current = p));
    const unsubscribeRot = api.quaternion.subscribe((q) => (rotation.current = q));
    return () => { unsubscribeVel(); unsubscribePos(); unsubscribeRot(); };
  }, [api]);

  const keys = useRef<{ [key: string]: boolean }>({});
  const lastUpdateTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'Space') setThrusting(true);
      if (e.code === 'KeyR') onRestart();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
      if (e.code === 'Space') setThrusting(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state) => {
    const shipPos = new THREE.Vector3(position.current[0], position.current[1], position.current[2]);
    const shipQuat = new THREE.Quaternion(rotation.current[0], rotation.current[1], rotation.current[2], rotation.current[3]);

    // Merkezi Yerçekimi HER ZAMAN uygulanır (kaza olsa bile ayda kalmaya veya savrulmaya devam eder)
    const moonCenter = new THREE.Vector3(0, orbY, 0);
    const dirToMoon = moonCenter.clone().sub(shipPos).normalize();
    const gravityForce = dirToMoon.multiplyScalar(1.6); // 1.6 m/s^2 ivme
    api.applyForce([gravityForce.x, gravityForce.y, gravityForce.z], [0, 0, 0]);

    // Oyun devam ediyorsa iticileri kullan
    if (status === 'playing') {
      const thrustPower = 25;
      const rotationPower = 2.5;

      if (keys.current['Space'] && fuel > 0) {
        api.applyLocalForce([0, thrustPower, 0], [0, 0, 0]);
        setFuel((f) => Math.max(0, f - 0.3));
      }
      if (keys.current['ArrowLeft'] || keys.current['KeyA']) api.applyTorque([0, 0, rotationPower]);
      if (keys.current['ArrowRight'] || keys.current['KeyD']) api.applyTorque([0, 0, -rotationPower]);
    }

    // Kamera her zaman geminin rotasyonunu (up vektörünü) takip eder!
    const localCamPos = new THREE.Vector3(0, 5, 25); // Geminin hafif üstü ve arkası
    const targetCamPos = localCamPos.applyQuaternion(shipQuat).add(shipPos);
    const shipUp = new THREE.Vector3(0, 1, 0).applyQuaternion(shipQuat);
    
    state.camera.position.lerp(targetCamPos, 0.1);
    state.camera.up.lerp(shipUp, 0.1); // Kameranın üst yönü geminin üst yönü ile aynı olur
    
    const lookTarget = shipPos.clone().add(new THREE.Vector3(0, 2, 0).applyQuaternion(shipQuat));
    state.camera.lookAt(lookTarget);

    const now = state.clock.getElapsedTime();
    if (now - lastUpdateTime.current > 0.1) {
      lastUpdateTime.current = now;
      const distToCenter = shipPos.distanceTo(moonCenter);
      const measuredAltitude = distToCenter - orbRadius - 0.75; // Yüzeye olan gerçek uzaklık
      onUpdate({
        fuel,
        velocity: Math.sqrt(velocity.current[0]**2 + velocity.current[1]**2 + velocity.current[2]**2),
        altitude: Math.max(0, measuredAltitude),
        status,
      });
    }
  });

  return (
    <group ref={ref as any}>
      <mesh>
        <boxGeometry args={[1, 1.5, 1]} />
        <meshBasicMaterial color="#00ff00" wireframe={true} visible={true} transparent opacity={0.3} />
      </mesh>
      {USE_3D_MODELS ? (
        <Suspense fallback={null}>
          <ApolloModel />
        </Suspense>
      ) : (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.7, 1.5, 12]} />
            <meshStandardMaterial color="#eee" metalness={0.3} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.8, 0]} castShadow>
            <sphereGeometry args={[0.4, 12, 12]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>
      )}

      {thrusting && fuel > 0 && (
        <group position={[0, -1.2, 0]}>
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.3, 1.5, 8]} />
            <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={5} />
          </mesh>
          <pointLight intensity={5} distance={10} color="#ffaa00" />
          <Sparkles count={30} scale={1} size={3} speed={1} color="#ffaa00" />
        </group>
      )}
    </group>
  );
};

export default function LunarLander({ onExit }: { onExit: () => void }) {
  const [gameState, setGameState] = useState<GameState>({ fuel: 100, velocity: 0, altitude: 25, status: 'playing' });
  const [gameKey, setGameKey] = useState(0); 

  const handleRestart = () => {
    setGameState({ fuel: 100, velocity: 0, altitude: 25, status: 'playing' });
    setGameKey((prev) => prev + 1);
  };

  const score = Math.floor(gameState.fuel * 25);

  return (
    <div className="relative h-full w-full bg-[#050505]">
      <div className="absolute top-8 right-8 z-50 flex items-center gap-6">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Puan</div>
          <div className="text-2xl font-mono text-emerald-400 font-bold">{score}</div>
        </div>
        
        <button 
          onClick={handleRestart}
          className="bg-black/80 hover:bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-full shadow-2xl transition-all hover:rotate-180 active:scale-90"
          title="Oyunu Yeniden Başlat (Tuş: R)"
        >
          <RotateCcw className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="absolute top-8 left-8 z-20 flex flex-col gap-4 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-end mb-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Yakıt Rezervi</div>
            <div className="text-xs font-mono text-orange-500">{gameState.fuel.toFixed(0)}%</div>
          </div>
          <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: "100%" }} animate={{ width: `${gameState.fuel}%` }} className="h-full bg-gradient-to-r from-orange-600 to-orange-400" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-2">Hız</div>
            <div className={`text-3xl font-mono tracking-tighter ${gameState.velocity > 6 ? 'text-red-500' : 'text-emerald-500'}`}>{gameState.velocity.toFixed(1)} <span className="text-sm opacity-40">m/s</span></div>
          </div>
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-2">İrtifa</div>
            <div className="text-3xl font-mono tracking-tighter text-white">{Math.max(0, gameState.altitude).toFixed(1)} <span className="text-sm opacity-40">m</span></div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {gameState.status !== 'playing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-2xl">
            <div className="text-center p-12">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20 }}>
                <h2 className={`text-7xl font-display font-black uppercase tracking-tighter mb-6 ${gameState.status === 'landed' ? 'text-emerald-500' : 'text-red-500'}`}>{gameState.status === 'landed' ? 'GÖREV BAŞARILI' : 'KRİTİK HASAR'}</h2>
                <p className="text-white/40 mb-6 max-w-md mx-auto text-lg leading-relaxed">
                  {gameState.status === 'landed' ? 'Kartal iniş yaptı. Ay istasyonuna başarıyla ulaştınız.' : 'Geminiz Ay kraterinde parçalandı. Görev başarısız oldu.'}
                </p>
                {gameState.status === 'landed' && (
                  <div className="text-4xl font-mono text-white mb-10 font-bold">
                    Kazanılan Puan: <span className="text-emerald-400">{score}</span>
                  </div>
                )}
                <div className="flex gap-6 justify-center">
                  <button onClick={handleRestart} className="px-12 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-sm rounded-full hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                    Tekrar Dene (R)
                  </button>
                  <button onClick={onExit} className="px-12 py-4 border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-sm rounded-full hover:bg-white/5 transition-all">
                    Menüye Dön
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-8 text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] pointer-events-none">
        <div className="flex items-center gap-3"><span className="px-2 py-1 border border-white/20 rounded">SPACE</span> İTİCİ</div>
        <div className="flex items-center gap-3"><span className="px-2 py-1 border border-white/20 rounded">YÖN TUŞLARI</span> SAĞ/SOL</div>
        <div className="flex items-center gap-3"><span className="px-2 py-1 border border-white/20 rounded">R</span> YENİDEN BAŞLAT</div>
      </div>

      <Canvas key={gameKey} shadows dpr={[1, 1.5]}>
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 100, 50]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-20, 20, 20]} intensity={1.5} color="#4444ff" />
        
        <Physics gravity={[0, 0, 0]}>
          <MoonGlobe />
          <LandingPad position={[0, 1.5, 0]} label="İSTASYON ALPHA" />
          <LandingPad position={[40, 1.5, 0]} label="İSTASYON BRAVO" />
          <LandingPad position={[-50, 1.5, 0]} label="İSTASYON CHARLIE" />
          <Spacecraft onUpdate={setGameState} onRestart={handleRestart} />
        </Physics>

        <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}
