import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import { Stars, OrbitControls, PerspectiveCamera, Text, Sparkles } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';

// --- Types ---
interface GameState {
  fuel: number;
  velocity: number;
  altitude: number;
  status: 'playing' | 'landed' | 'crashed';
}

// --- Components ---

const MoonSurface = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <group>
      <mesh ref={ref as any} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#444" roughness={0.9} />
      </mesh>
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[Math.random() * 100 - 50, 0.1, Math.random() * 100 - 50]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.5, 2, 16]} />
          <meshStandardMaterial color="#222" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const LandingPad = ({ position, label }: { position: [number, number, number], label: string }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: [6, 0.5, 6],
  }));

  return (
    <group position={position}>
      <mesh ref={ref as any} receiveShadow>
        <boxGeometry args={[6, 0.5, 6]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 2, 0]} intensity={2} color="#00ff88" />
      <Text position={[0, 1, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
};

const Spacecraft = ({ onUpdate }: { onUpdate: (state: GameState) => void }) => {
  const [fuel, setFuel] = useState(100);
  const [status, setStatus] = useState<'playing' | 'landed' | 'crashed'>('playing');
  const [thrusting, setThrusting] = useState(false);
  
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 25, 0],
    args: [1, 1.5, 1],
    linearDamping: 0.1,
    angularDamping: 0.5,
    onCollide: (e) => {
      const impactVelocity = Math.abs(e.contact.impactVelocity);
      if (impactVelocity > 6) setStatus('crashed');
      else if (Math.abs(e.contact.contactNormal[1]) > 0.7) setStatus('landed');
    },
  }));

  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 0, 0]);

  useEffect(() => {
    const unsubscribeVel = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubscribePos = api.position.subscribe((p) => (position.current = p));
    return () => { unsubscribeVel(); unsubscribePos(); };
  }, [api]);

  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'Space') setThrusting(true);
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
    if (status !== 'playing') return;
    const thrustPower = 25;
    const rotationPower = 3;

    if (keys.current['Space'] && fuel > 0) {
      api.applyLocalForce([0, thrustPower, 0], [0, 0, 0]);
      setFuel((f) => Math.max(0, f - 0.3));
    }
    if (keys.current['ArrowLeft'] || keys.current['KeyA']) api.applyTorque([0, 0, rotationPower]);
    if (keys.current['ArrowRight'] || keys.current['KeyD']) api.applyTorque([0, 0, -rotationPower]);

    const camPos = new THREE.Vector3(position.current[0], position.current[1] + 5, position.current[0] + 25);
    state.camera.position.lerp(camPos, 0.1);
    state.camera.lookAt(position.current[0], position.current[1], position.current[2]);

    onUpdate({
      fuel,
      velocity: Math.sqrt(velocity.current[0]**2 + velocity.current[1]**2 + velocity.current[2]**2),
      altitude: position.current[1],
      status,
    });
  });

  return (
    <group ref={ref as any}>
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.7, 1.5, 12]} />
        <meshStandardMaterial color="#eee" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <group position={[0, -0.6, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI) / 2, 0.5]} position={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1]} />
            <meshStandardMaterial color="#888" />
          </mesh>
        ))}
      </group>
      {thrusting && fuel > 0 && (
        <group position={[0, -1, 0]}>
          <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.3, 1, 8]} /><meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={5} /></mesh>
          <pointLight intensity={5} distance={10} color="#ffaa00" />
          <Sparkles count={20} scale={1} size={2} speed={0.5} color="#ffaa00" />
        </group>
      )}
    </group>
  );
};

export default function LunarLander({ onExit }: { onExit: () => void }) {
  const [gameState, setGameState] = useState<GameState>({ fuel: 100, velocity: 0, altitude: 25, status: 'playing' });

  return (
    <div className="relative h-full w-full bg-[#050505]">
      <div className="absolute top-8 left-8 z-20 flex flex-col gap-4 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-end mb-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Fuel Reserve</div>
            <div className="text-xs font-mono text-orange-500">{gameState.fuel.toFixed(0)}%</div>
          </div>
          <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: "100%" }} animate={{ width: `${gameState.fuel}%` }} className="h-full bg-gradient-to-r from-orange-600 to-orange-400" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-2">Velocity</div>
            <div className={`text-3xl font-mono tracking-tighter ${gameState.velocity > 6 ? 'text-red-500' : 'text-emerald-500'}`}>{gameState.velocity.toFixed(1)} <span className="text-sm opacity-40">m/s</span></div>
          </div>
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-2">Altitude</div>
            <div className="text-3xl font-mono tracking-tighter text-white">{gameState.altitude.toFixed(1)} <span className="text-sm opacity-40">m</span></div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {gameState.status !== 'playing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-2xl">
            <div className="text-center p-12">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20 }}>
                <h2 className={`text-7xl font-display font-black uppercase tracking-tighter mb-6 ${gameState.status === 'landed' ? 'text-emerald-500' : 'text-red-500'}`}>{gameState.status === 'landed' ? 'Mission Success' : 'Mission Failed'}</h2>
                <p className="text-white/40 mb-12 max-w-md mx-auto text-lg leading-relaxed">{gameState.status === 'landed' ? 'The Eagle has landed. You have successfully navigated the lunar descent.' : 'Critical impact detected. The spacecraft has been lost in the lunar dust.'}</p>
                <div className="flex gap-6 justify-center">
                  <button onClick={() => window.location.reload()} className="px-12 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-sm rounded-full hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">Try Again</button>
                  <button onClick={onExit} className="px-12 py-4 border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-sm rounded-full hover:bg-white/5 transition-all">Return to Menu</button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-12 text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] pointer-events-none">
        <div className="flex items-center gap-3"><span className="px-2 py-1 border border-white/20 rounded">SPACE</span> THRUST</div>
        <div className="flex items-center gap-3"><span className="px-2 py-1 border border-white/20 rounded">ARROWS</span> ROTATE</div>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 100, 50]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[-20, 20, -20]} intensity={1} color="#4444ff" />
        <Physics gravity={[0, -1.6, 0]}>
          <MoonSurface />
          <LandingPad position={[0, 0.25, 0]} label="ALPHA-1" />
          <LandingPad position={[40, 0.25, 20]} label="BRAVO-2" />
          <LandingPad position={[-30, 0.25, -40]} label="CHARLIE-3" />
          <Spacecraft onUpdate={setGameState} />
        </Physics>
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} minDistance={10} maxDistance={50} />
      </Canvas>
    </div>
  );
}
