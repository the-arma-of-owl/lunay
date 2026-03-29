import React, { useState, useEffect, useRef, Suspense, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, useSphere, useBox } from '@react-three/cannon';
import { Stars, Text, useGLTF, Center } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Radio, AlertTriangle } from 'lucide-react';
import * as THREE from 'three';

// --- CONFIG ---
const USE_3D_MODELS = true;
const ORB_RADIUS = 100;
const ORB_Y = -100;
const MAX_METEORS = 5;
const MAX_DEBRIS = 4;

// --- Space debris real-world facts (social consciousness) ---
const SPACE_FACTS = [
  { stat: '27,000+', label: 'takip edilen yörünge çöpü', source: 'NASA' },
  { stat: '128M', label: 'küçük parça (1mm-1cm)', source: 'ESA' },
  { stat: '500k', label: 'mermer büyüklüğünde enkaz', source: 'ESA' },
  { stat: '7km/s', label: 'ortalama çarpışma hızı', source: 'JAXA' },
  { stat: '22,300+', label: 'büyük nesne aktif izleniyor', source: 'CSpOC' },
  { stat: '1978', label: 'Kessler Teorisi ilk kez ortaya atıldı', source: 'NASA' },
  { stat: '2009', label: 'Cosmos-Iridium ilk büyük uydu çarpışması', source: 'Roscosmos' },
  { stat: '%60', label: 'çöpün Rusya & ABD kaynaklı olduğu tahmin', source: 'ESA' },
];

// --- Debris origin labels ---
const DEBRIS_ORIGINS = [
  'Sputnik-2 Kalıntısı 🇷🇺', 'Fengyun-1C Parçası 🇨🇳', 'ASAT Testi Enkazı 🇮🇳',
  'Iridium-33 Parçası 🇺🇸', 'Cosmos-954 🇷🇺', 'SNAP-10A Paneli 🇺🇸',
  'CZ-4C Üst Kademesi 🇨🇳', 'Bilinmeyen Kaynak ❓',
];

// --- Nation Pre-Warning Messages ---
const NATIONS = [
  { flag: '🇺🇸', code: 'NASA' },
  { flag: '🇪🇺', code: 'ESA' },
  { flag: '🇷🇺', code: 'RKA' },
  { flag: '🇯🇵', code: 'JAXA' },
  { flag: '🇨🇳', code: 'CNSA' },
  { flag: '🇮🇳', code: 'ISRO' },
];

function makeWarning(pos: THREE.Vector3, type: 'meteor' | 'debris') {
  const nation = NATIONS[Math.floor(Math.random() * NATIONS.length)];
  const cx = pos.x.toFixed(0);
  const cy = pos.y.toFixed(0);
  const kind = type === 'meteor' ? 'METEORİT' : 'UZAY ÇÖPÜ';
  const origin = type === 'debris' ? DEBRIS_ORIGINS[Math.floor(Math.random() * DEBRIS_ORIGINS.length)] : '';
  const originTag = origin ? ` [${origin}]` : '';
  const actions = [
    `Koordinat [${cx}, ${cy}]'den gelen ${kind}${originTag} tespit edildi. Kaçınma manevrası yapın!`,
    `Uzay koordinat sistemi uyarısı: ${kind}${originTag} — POS(${cx}, ${cy}). Derhal manevra yapın.`,
    `${kind}${originTag} geliyor! Konum: [X:${cx} Y:${cy}]. Hemen kaçının!`,
  ];
  const msg = actions[Math.floor(Math.random() * actions.length)];
  return { flag: nation.flag, nation: nation.code, message: msg };
}

// --- Shared mutable threat pool (lives outside React) ---
interface ThreatEntry {
  active: boolean;
  type: 'meteor' | 'debris';
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  radius: number;
  meshRef: React.RefObject<THREE.Mesh | THREE.Group>;
}

// Pool arrays — allocated once
const meteorPool: ThreatEntry[] = Array.from({ length: MAX_METEORS }, () => ({
  active: false, type: 'meteor' as const,
  pos: new THREE.Vector3(), vel: new THREE.Vector3(),
  radius: 2, meshRef: React.createRef(),
}));
const debrisPool: ThreatEntry[] = Array.from({ length: MAX_DEBRIS }, () => ({
  active: false, type: 'debris' as const,
  pos: new THREE.Vector3(), vel: new THREE.Vector3(),
  radius: 1, meshRef: React.createRef(),
}));

function spawnMeteor() {
  const slot = meteorPool.find(t => !t.active);
  if (!slot) return null;
  const angle = Math.random() * Math.PI * 2;
  const dist = 220 + Math.random() * 60;
  slot.pos.set(Math.cos(angle) * dist, ORB_Y + (Math.random() - 0.5) * 150, 0);
  const target = new THREE.Vector3((Math.random() - 0.5) * 60, ORB_Y + (Math.random() - 0.5) * 60, 0);
  slot.vel.copy(target).sub(slot.pos).normalize().multiplyScalar(14 + Math.random() * 10);
  slot.radius = 1.8 + Math.random() * 2.5;
  slot.active = true;
  return slot;
}

function spawnDebris() {
  const slot = debrisPool.find(t => !t.active);
  if (!slot) return null;
  const angle = Math.random() * Math.PI * 2;
  const dist = 160 + Math.random() * 50;
  slot.pos.set(Math.cos(angle) * dist, ORB_Y + (Math.random() - 0.5) * 100, 0);
  // Fast — debris moves at 16-24 units/s
  const speed = 16 + Math.random() * 8;
  const dir = new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), 0).normalize();
  slot.vel.copy(dir).multiplyScalar(speed);
  slot.radius = 1.0;
  slot.active = true;
  return slot;
}

// --- Audio Engine ---
class AudioEngine {
  ctx: AudioContext | null = null;
  thrustGain: GainNode | null = null;
  rcsGain: GainNode | null = null;
  initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.thrustGain = this.ctx.createGain(); this.thrustGain.gain.value = 0; this.thrustGain.connect(this.ctx.destination);
    this.rcsGain = this.ctx.createGain(); this.rcsGain.gain.value = 0; this.rcsGain.connect(this.ctx.destination);
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const out = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;
    const f1 = this.ctx.createBiquadFilter(); f1.type = 'lowpass'; f1.frequency.value = 400;
    const s1 = this.ctx.createBufferSource(); s1.buffer = noiseBuffer; s1.loop = true; s1.connect(f1); f1.connect(this.thrustGain); s1.start();
    const f2 = this.ctx.createBiquadFilter(); f2.type = 'highpass'; f2.frequency.value = 3000;
    const s2 = this.ctx.createBufferSource(); s2.buffer = noiseBuffer; s2.loop = true; s2.connect(f2); f2.connect(this.rcsGain); s2.start();
  }
  setThrust(active: boolean) {
    if (!this.initialized && active) this.init();
    if (this.initialized && this.ctx && this.thrustGain)
      this.thrustGain.gain.setTargetAtTime(active ? 0.2 : 0, this.ctx.currentTime, 0.05);
  }
  setRcs(active: boolean) {
    if (!this.initialized && active) this.init();
    if (this.initialized && this.ctx && this.rcsGain)
      this.rcsGain.gain.setTargetAtTime(active ? 0.15 : 0, this.ctx.currentTime, 0.05);
  }
}
const audioEngine = new AudioEngine();

// --- Types ---
interface GameState {
  fuel: number; velocity: number; altitude: number;
  status: 'playing' | 'landed' | 'crashed'; onPad?: boolean;
}
interface NationAlert { flag: string; nation: string; message: string; id: number; }
interface ScreenArrow { x: number; y: number; angle: number; type: 'meteor' | 'debris'; dist: number; }

// --- Reusable Vectors ---
const _shipPos = new THREE.Vector3();
const _moonCenter = new THREE.Vector3();
const _dirToMoon = new THREE.Vector3();
const _localCamPos = new THREE.Vector3();
const _shipUp = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _shipQuat = new THREE.Quaternion();
const _contactNormal = new THREE.Vector3();
const _upVec = new THREE.Vector3(0, 1, 0);
const _ndc = new THREE.Vector3();

// --- Moon Globe ---
const MoonGlobe = React.memo(() => {
  const [ref] = useSphere(() => ({ type: 'Static', args: [ORB_RADIUS], position: [0, ORB_Y, 0] }), useRef(null));
  return (
    <group>
      {USE_3D_MODELS ? (
        <Suspense fallback={null}><GlobeModel position={[0, ORB_Y, 0]} scale={100.5} /></Suspense>
      ) : (
        <mesh position={[0, ORB_Y, 0]} receiveShadow>
          <sphereGeometry args={[ORB_RADIUS, 48, 48]} />
          <meshStandardMaterial color="#444" roughness={0.9} />
        </mesh>
      )}
      <mesh position={[0, ORB_Y, 0]}>
        <sphereGeometry args={[ORB_RADIUS, 32, 32]} />
        <meshBasicMaterial color="#ff2222" wireframe opacity={0.35} transparent />
      </mesh>
    </group>
  );
});

const GlobeModel = React.memo(({ position, scale }: { position: [number, number, number]; scale: number }) => {
  const { scene } = useGLTF('/moon_perfect_globe.glb') as any;
  return <group position={position}><Center><primitive object={scene} scale={[scale, scale, scale]} /></Center></group>;
});

const ApolloModel = React.memo(() => {
  const { scene } = useGLTF('/spacecraft.glb') as any;
  return <primitive object={scene} scale={[0.5, 0.5, 0.5]} position={[0, -0.8, 0]} />;
});

// --- Landing Pads ---
const LANDING_PADS = [
  { angle: 0, label: 'İSTASYON ALPHA', color: '#00ff88' },
  { angle: 45, label: 'İSTASYON BRAVO', color: '#0088ff' },
  { angle: -60, label: 'İSTASYON CHARLIE', color: '#ff0088' },
] as const;

const LandingPad = React.memo(({ angle, label, color }: { angle: number; label: string; color: string }) => {
  const { pos, euler } = useMemo(() => {
    const rad = THREE.MathUtils.degToRad(angle);
    const x = ORB_RADIUS * Math.sin(rad);
    const y = ORB_Y + ORB_RADIUS * Math.cos(rad);
    const p = new THREE.Vector3(x, y, 0);
    const normal = p.clone().sub(new THREE.Vector3(0, ORB_Y, 0)).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    const e = new THREE.Euler().setFromQuaternion(q);
    return { pos: [x, y, 0] as [number, number, number], euler: e };
  }, [angle]);
  const [ref] = useBox(() => ({ type: 'Static', position: pos, rotation: [euler.x, euler.y, euler.z], args: [6, 1, 6] }), useRef(null));
  return (
    <group ref={ref as any}>
      <mesh receiveShadow>
        <boxGeometry args={[6, 1, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[0, 2, 0]} intensity={2} color={color} distance={40} />
      <Text position={[0, 1.5, 0]} fontSize={0.8} color="white" anchorX="center" anchorY="middle" outlineWidth={0.05} outlineColor="black">{label}</Text>
    </group>
  );
});

// ============================================================
// METEOR VISUAL (persistent mesh, position managed by pool ref)
// ============================================================
const MeteorMesh = React.memo(({ entry }: { entry: ThreatEntry }) => {
  return (
    <group ref={entry.meshRef as React.RefObject<THREE.Group>}>
      <mesh>
        <dodecahedronGeometry args={[entry.radius, 0]} />
        <meshStandardMaterial color="#c0622a" roughness={0.85} metalness={0.1} emissive="#5a1a00" emissiveIntensity={0.3} />
      </mesh>
      <pointLight intensity={1.5} distance={15} color="#ff4400" />
    </group>
  );
});

// ============================================================
// DEBRIS VISUAL
// ============================================================
const DebrisMesh = React.memo(({ entry }: { entry: ThreatEntry }) => {
  return (
    <group ref={entry.meshRef as React.RefObject<THREE.Group>}>
      <mesh>
        <boxGeometry args={[0.8, 0.25, 1.8]} />
        <meshStandardMaterial color="#999" metalness={0.85} roughness={0.25} emissive="#334" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 1.6, 0.3]} />
        <meshStandardMaterial color="#224" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 1.6, 0.3]} />
        <meshStandardMaterial color="#224" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
});

// ============================================================
// THREATS SYSTEM — manages pool positions directly via refs
// ============================================================
const ThreatSystem = ({
  shipPosRef,
  onThreatHit,
  onNewThreat,
  onUpdateArrows,
}: {
  shipPosRef: React.RefObject<THREE.Vector3>;
  onThreatHit: () => void;
  onNewThreat: (pos: THREE.Vector3, type: 'meteor' | 'debris') => void;
  onUpdateArrows: (arrows: ScreenArrow[]) => void;
}) => {
  const meteorTimer = useRef(0);
  const debrisTimer = useRef(0);
  const hitCooldown = useRef(false);
  const { camera, size } = useThree();
  const moonVec = useMemo(() => new THREE.Vector3(0, ORB_Y, 0), []);

  useFrame((_, delta) => {
    meteorTimer.current += delta;
    debrisTimer.current += delta;

    // ---- SPAWN ----
    if (meteorTimer.current > 6) {
      meteorTimer.current = 0;
      const slot = spawnMeteor();
      if (slot) onNewThreat(slot.pos.clone(), 'meteor');
    }
    if (debrisTimer.current > 11) {
      debrisTimer.current = 0;
      const slot = spawnDebris();
      if (slot) onNewThreat(slot.pos.clone(), 'debris');
    }

    const arrows: ScreenArrow[] = [];
    const allThreats = [...meteorPool, ...debrisPool];

    for (const t of allThreats) {
      if (!t.active) continue;
      const mesh = t.meshRef.current;
      if (!mesh) continue;

      // Move mesh directly
      t.pos.addScaledVector(t.vel, delta);
      mesh.position.copy(t.pos);

      // Rotate
      if (t.type === 'meteor') {
        mesh.rotation.x += delta * 1.2;
        mesh.rotation.y += delta * 0.7;
      } else {
        mesh.rotation.z += delta * 0.4;
        mesh.rotation.x += delta * 0.2;
      }

      // Deactivate if hits moon or flies too far
      const distMoon = t.pos.distanceTo(moonVec);
      if (t.pos.length() > 600 || distMoon < ORB_RADIUS + t.radius) {
        t.active = false;
        mesh.position.set(9999, 9999, 9999); // hide
        continue;
      }

      // Collision with ship
      if (!hitCooldown.current && shipPosRef.current) {
        const distShip = t.pos.distanceTo(shipPosRef.current);
        if (distShip < t.radius + 1.8) {
          hitCooldown.current = true;
          onThreatHit();
          setTimeout(() => { hitCooldown.current = false; }, 4000);
        }
      }

      // Screen-space arrow
      if (shipPosRef.current) {
        _ndc.copy(t.pos).project(camera);
        const sx = (_ndc.x * 0.5 + 0.5) * size.width;
        const sy = (1 - (_ndc.y * 0.5 + 0.5)) * size.height;

        const toThreat = t.pos.clone().sub(shipPosRef.current);
        const dist2d = Math.hypot(toThreat.x, toThreat.y);
        const angle = Math.atan2(-toThreat.y, toThreat.x);

        // show arrow if off-screen or within 80 units
        const offScreen = sx < -20 || sx > size.width + 20 || sy < -20 || sy > size.height + 20;
        if (offScreen || dist2d < 80) {
          // clamp to screen edge
          const margin = 36;
          const cx = size.width / 2;
          const cy = size.height / 2;
          let ax = sx, ay = sy;
          if (offScreen) {
            const dx = _ndc.x, dy = -_ndc.y;
            const scale = Math.min((cx - margin) / Math.abs(dx || 0.001), (cy - margin) / Math.abs(dy || 0.001));
            ax = cx + dx * scale;
            ay = cy + dy * scale;
          }
          arrows.push({ x: ax, y: ay, angle, type: t.type, dist: dist2d });
        }
      }
    }

    onUpdateArrows(arrows);
  });

  return (
    <>
      {meteorPool.map((m, i) => <MeteorMesh key={`m${i}`} entry={m} />)}
      {debrisPool.map((d, i) => <DebrisMesh key={`d${i}`} entry={d} />)}
    </>
  );
};

// ============================================================
// SPACECRAFT
// ============================================================
const PAD_ANGLES = [0, 45, -60];
const Spacecraft = ({
  onUpdate, onRestart, shipPosRef,
}: {
  onUpdate: (state: GameState) => void;
  onRestart: () => void;
  shipPosRef: React.RefObject<THREE.Vector3>;
}) => {
  const [fuel, setFuel] = useState(100);
  const [status, setStatus] = useState<'playing' | 'landed' | 'crashed'>('playing');
  const [thrusting, setThrusting] = useState(false);
  const [turningLeft, setTurningLeft] = useState(false);
  const [turningRight, setTurningRight] = useState(false);
  const position = useRef([0, 0, 0]);
  const velocity = useRef([0, 0, 0]);
  const rotation = useRef([0, 0, 0, 1]);

  const handleCollide = useCallback((e: any) => {
    if (status !== 'playing') return;
    const impactVelocity = Math.abs(e.contact.impactVelocity);
    _shipQuat.set(rotation.current[0], rotation.current[1], rotation.current[2], rotation.current[3]);
    _shipUp.copy(_upVec).applyQuaternion(_shipQuat);
    _contactNormal.set(e.contact.contactNormal[0], e.contact.contactNormal[1], e.contact.contactNormal[2]);
    const isUpright = _shipUp.dot(_contactNormal) > 0.6;
    setStatus(impactVelocity > 6 || !isUpright ? 'crashed' : 'landed');
  }, [status]);

  const [ref, api] = useBox(() => ({
    mass: 1, position: [0, 25, 0], args: [1, 1.5, 1],
    linearDamping: 0.1, angularDamping: 0.5,
    angularFactor: [0, 0, 1], linearFactor: [1, 1, 0],
    onCollide: handleCollide,
  }));

  useEffect(() => {
    const uv = api.velocity.subscribe(v => (velocity.current = v));
    const up = api.position.subscribe(p => (position.current = p));
    const ur = api.quaternion.subscribe(q => (rotation.current = q));
    return () => { uv(); up(); ur(); };
  }, [api]);

  const keys = useRef<{ [k: string]: boolean }>({});
  const lastUpdate = useRef(0);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'Space') setThrusting(true);
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') setTurningLeft(true);
      if (e.code === 'ArrowRight' || e.code === 'KeyD') setTurningRight(true);
    };
    const ku = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
      if (e.code === 'Space') setThrusting(false);
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') setTurningLeft(false);
      if (e.code === 'ArrowRight' || e.code === 'KeyD') setTurningRight(false);
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, []);

  useFrame((state) => {
    _shipPos.set(position.current[0], position.current[1], position.current[2]);
    _shipQuat.set(rotation.current[0], rotation.current[1], rotation.current[2], rotation.current[3]);
    (shipPosRef as any).current.copy(_shipPos);

    _moonCenter.set(0, ORB_Y, 0);
    const distToCenter = _shipPos.distanceTo(_moonCenter);
    const measuredAltitude = Math.max(0, distToCenter - ORB_RADIUS - 0.75);

    _dirToMoon.copy(_moonCenter).sub(_shipPos).normalize().multiplyScalar(1.6);
    api.applyForce([_dirToMoon.x, _dirToMoon.y, _dirToMoon.z], [0, 0, 0]);

    if (status === 'playing') {
      if (keys.current['Space'] && fuel > 0) {
        api.applyLocalForce([0, 25, 0], [0, 0, 0]);
        setFuel(f => Math.max(0, f - 0.3));
        audioEngine.setThrust(true);
      } else { audioEngine.setThrust(false); }

      const rcs = (keys.current['ArrowLeft'] || keys.current['KeyA'] || keys.current['ArrowRight'] || keys.current['KeyD']) && fuel > 0;
      audioEngine.setRcs(!!rcs);

      if ((keys.current['ArrowLeft'] || keys.current['KeyA']) && fuel > 0) {
        api.applyTorque([0, 0, 2.5]); setFuel(f => Math.max(0, f - 0.1));
      }
      if ((keys.current['ArrowRight'] || keys.current['KeyD']) && fuel > 0) {
        api.applyTorque([0, 0, -2.5]); setFuel(f => Math.max(0, f - 0.1));
      }
    } else { audioEngine.setThrust(false); audioEngine.setRcs(false); }

    _localCamPos.set(0, 5, 25).applyQuaternion(_shipQuat).add(_shipPos);
    _shipUp.copy(_upVec).applyQuaternion(_shipQuat);
    state.camera.position.lerp(_localCamPos, 0.1);
    state.camera.up.lerp(_shipUp, 0.1);
    _lookTarget.set(0, 2, 0).applyQuaternion(_shipQuat).add(_shipPos);
    state.camera.lookAt(_lookTarget);

    const now = state.clock.getElapsedTime();
    if (now - lastUpdate.current > 0.1) {
      lastUpdate.current = now;
      const shipAngle = Math.atan2(_shipPos.x, _shipPos.y - ORB_Y) * (180 / Math.PI);
      const onPad = status === 'landed' && PAD_ANGLES.some(a => Math.abs(a - shipAngle) < 3);
      onUpdate({ fuel, velocity: Math.sqrt(velocity.current[0] ** 2 + velocity.current[1] ** 2), altitude: measuredAltitude, status, onPad });
    }
    if (status === 'landed') {
      const shipAngle = Math.atan2(_shipPos.x, _shipPos.y - ORB_Y) * (180 / Math.PI);
      if (PAD_ANGLES.some(a => Math.abs(a - shipAngle) < 5) && fuel < 100)
        setFuel(f => Math.min(100, f + 0.5));
    }
  });

  return (
    <group ref={ref as any}>
      {USE_3D_MODELS ? (
        <Suspense fallback={null}><ApolloModel /></Suspense>
      ) : (
        <group>
          <mesh castShadow><cylinderGeometry args={[0.4, 0.7, 1.5, 12]} /><meshStandardMaterial color="#eee" /></mesh>
          <mesh position={[0, 0.8, 0]} castShadow><sphereGeometry args={[0.4, 12, 12]} /><meshStandardMaterial color="#333" /></mesh>
        </group>
      )}
      <pointLight position={[0, -2, 0]} distance={40} intensity={3} color="#ffffff" decay={2} />
      {thrusting && fuel > 0 && (
        <group position={[0, -1.2, 0]}>
          <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.2, 1.2, 8]} /><meshStandardMaterial color="#88ddff" emissive="#ffffff" emissiveIntensity={3} transparent opacity={0.8} /></mesh>
          <pointLight intensity={3} distance={10} color="#88ddff" />
        </group>
      )}
      {turningRight && fuel > 0 && (
        <group position={[-1.2, 0.2, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[0.15, 1.0, 8]} /><meshStandardMaterial color="#88ddff" emissive="#ffffff" emissiveIntensity={3} transparent opacity={0.8} /></mesh>
          <pointLight intensity={3} distance={10} color="#88ddff" />
        </group>
      )}
      {turningLeft && fuel > 0 && (
        <group position={[1.2, 0.2, 0]}>
          <mesh rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.15, 1.0, 8]} /><meshStandardMaterial color="#88ddff" emissive="#ffffff" emissiveIntensity={3} transparent opacity={0.8} /></mesh>
          <pointLight intensity={3} distance={10} color="#88ddff" />
        </group>
      )}
    </group>
  );
};

// ============================================================
// RADAR HUD
// ============================================================
const RADAR_SIZE = 148;
const RadarHUD = ({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement> }) => (
  <div className="absolute bottom-24 right-8 z-20">
    <canvas
      ref={canvasRef}
      width={RADAR_SIZE}
      height={RADAR_SIZE}
      style={{ borderRadius: '50%', boxShadow: '0 0 24px rgba(0,255,100,0.35), 0 0 3px #00ff6688', display: 'block' }}
    />
  </div>
);

// Radar drawing — called from useFrame inside Canvas
const RadarRenderer = ({
  shipPosRef, radarCanvasRef,
}: {
  shipPosRef: React.RefObject<THREE.Vector3>;
  radarCanvasRef: React.RefObject<HTMLCanvasElement>;
}) => {
  const moonVec = useMemo(() => new THREE.Vector3(0, ORB_Y, 0), []);
  useFrame(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const S = RADAR_SIZE;
    const cx = S / 2, cy = S / 2, r = S / 2 - 4;
    const RANGE = 280;
    const sp = shipPosRef.current;

    ctx.clearRect(0, 0, S, S);

    // Background
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,18,8,0.90)'; ctx.fill();
    ctx.strokeStyle = '#00ff6644'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.clip(); // keep content inside circle

    // Rings
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath(); ctx.arc(cx, cy, r * i / 3, 0, Math.PI * 2);
      ctx.strokeStyle = '#00ff440d'; ctx.lineWidth = 1; ctx.stroke();
    }
    // Cross
    ctx.strokeStyle = '#00ff4415'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();

    // Moon
    if (sp) {
      const rel = moonVec.clone().sub(sp);
      const mx = cx + rel.x / RANGE * r;
      const my = cy - rel.y / RANGE * r;
      ctx.beginPath(); ctx.arc(mx, my, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#88888830'; ctx.fill();
      ctx.strokeStyle = '#88888860'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    // Threats
    for (const t of [...meteorPool, ...debrisPool]) {
      if (!t.active) continue;
      if (!sp) continue;
      const rel = t.pos.clone().sub(sp);
      const tx2 = cx + rel.x / RANGE * r;
      const ty2 = cy - rel.y / RANGE * r;
      const inside = Math.hypot(tx2 - cx, ty2 - cy) < r - 3;
      const isClose = t.pos.distanceTo(sp) < 50;

      if (inside) {
        ctx.beginPath(); ctx.arc(tx2, ty2, t.type === 'meteor' ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = t.type === 'meteor' ? (isClose ? '#ff4400dd' : '#ff8800aa') : (isClose ? '#ff2200cc' : '#ff666660');
        ctx.fill();
        if (isClose) {
          ctx.beginPath(); ctx.arc(tx2, ty2, 9, 0, Math.PI * 2);
          ctx.strokeStyle = t.type === 'meteor' ? '#ff440088' : '#ff220066'; ctx.lineWidth = 1.5; ctx.stroke();
        }
      }
    }

    // Sweep
    const sweepAngle = (Date.now() / 1000) % (Math.PI * 2);
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(-sweepAngle);
    const sweep = ctx.createLinearGradient(0, 0, r, 0);
    sweep.addColorStop(0, '#00ff4440'); sweep.addColorStop(1, '#00ff4400');
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, -0.5, 0); ctx.closePath();
    ctx.fillStyle = sweep; ctx.fill();
    ctx.restore();

    // Ship dot
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00ffaa'; ctx.fill();

    ctx.restore(); // end clip

    // Label
    ctx.fillStyle = '#00ff6677'; ctx.font = 'bold 9px monospace';
    ctx.fillText('RADAR', 6, 14);
  });
  return null;
};

// ============================================================
// SCREEN EDGE ARROWS (2D Canvas overlay)
// ============================================================
const ArrowOverlay = ({ arrowsRef }: { arrowsRef: React.RefObject<ScreenArrow[]> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let raf: number;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const arrows = arrowsRef.current ?? [];
      for (const a of arrows) {
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.angle + Math.PI / 2);

        const isMeteor = a.type === 'meteor';
        const col = isMeteor ? '#ff4400' : '#ff2288';
        const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 200);

        // Arrow triangle
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(-10, 8);
        ctx.lineTo(10, 8);
        ctx.closePath();
        ctx.fillStyle = col + Math.round(pulse * 220).toString(16).padStart(2, '0');
        ctx.fill();
        ctx.strokeStyle = '#fff4';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Distance label
        ctx.rotate(-(a.angle + Math.PI / 2));
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${isMeteor ? '☄' : '🛸'} ${Math.round(a.dist)}`, 0, 28);

        ctx.restore();
      }
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [arrowsRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
      style={{ width: '100%', height: '100%' }}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

// ============================================================
// NATION PRE-WARNING ALERT
// ============================================================
const NationAlert = React.memo(({ alert }: { alert: NationAlert | null }) => (
  <AnimatePresence mode="wait">
    {alert && (
      <motion.div
        key={alert.id}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="absolute top-28 left-1/2 -translate-x-1/2 z-40 pointer-events-none w-[380px]"
      >
        <div className="bg-black/85 backdrop-blur-xl border border-red-500/40 rounded-2xl shadow-[0_0_30px_rgba(255,50,0,0.3)] overflow-hidden">
          <div className="flex items-center gap-2 bg-red-900/30 px-4 py-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-red-400 font-bold">Uzay Koordinat Uyarısı</span>
            <span className="ml-auto text-[9px] text-white/30 font-mono">{new Date().toISOString().slice(11, 19)} UTC</span>
          </div>
          <div className="flex items-start gap-3 px-4 py-3">
            <span className="text-2xl mt-0.5">{alert.flag}</span>
            <div>
              <div className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">{alert.nation}</div>
              <div className="text-xs text-white/85 leading-relaxed">{alert.message}</div>
              <div className="mt-2 text-[9px] text-amber-400 font-bold uppercase tracking-widest">
                ⚠ Uzay çöpü tüm insanlık için tehdit oluşturmaktadır
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));

// --- Score & Controls ---
const ScoreDisplay = React.memo(({ score }: { score: number }) => (
  <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl">
    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Puan</div>
    <div className="text-2xl font-mono text-emerald-400 font-bold">{score}</div>
  </div>
));
const ControlsHint = React.memo(() => (
  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-8 text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] pointer-events-none">
    <div className="flex items-center gap-3"><span className="px-2 py-1 border border-white/20 rounded">SPACE</span> İTİCİ</div>
    <div className="flex items-center gap-3"><span className="px-2 py-1 border border-white/20 rounded">YÖN TUŞLARI</span> SAĞ/SOL</div>
    <div className="flex items-center gap-3"><span className="px-2 py-1 border border-white/20 rounded">R</span> YENİDEN BAŞLAT</div>
  </div>
));

// --- Space Facts Ticker (bottom left, social consciousness) ---
const SpaceFactsTicker = React.memo(() => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % SPACE_FACTS.length); setVisible(true); }, 500);
    }, 8000);
    return () => clearInterval(iv);
  }, []);
  const f = SPACE_FACTS[idx];
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
          className="absolute bottom-24 left-8 z-20 pointer-events-none">
          <div className="bg-black/75 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-xl px-4 py-3 max-w-[220px]">
            <div className="text-[8px] uppercase tracking-[0.3em] text-cyan-400/70 font-bold mb-1">🌍 Gerçek İstatistik · {f.source}</div>
            <div className="text-2xl font-black text-cyan-300 font-mono leading-none">{f.stat}</div>
            <div className="text-[10px] text-white/60 mt-1 leading-snug">{f.label}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// --- Kessler Syndrome Bar (top center) ---
const KesslerBar = React.memo(({ level }: { level: number }) => {
  const pct = Math.min(100, level);
  const color = pct < 40 ? '#22d3ee' : pct < 70 ? '#f97316' : '#ef4444';
  const label = pct < 40 ? 'DÜŞÜK' : pct < 70 ? 'ORTA' : 'KRİTİK';
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1">
      <div className="text-[8px] uppercase tracking-[0.3em] font-bold" style={{ color: color + 'aa' }}>
        Kessler Tehlike Seviyesi · {label}
      </div>
      <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 1.2 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(to right, #22d3ee, ${color})` }} />
      </div>
    </div>
  );
});

// ============================================================
// MAIN
// ============================================================
export default function LunarLander({ onExit }: { onExit: () => void }) {
  const [gameState, setGameState] = useState<GameState>({ fuel: 100, velocity: 0, altitude: 25, status: 'playing' });
  const [gameKey, setGameKey] = useState(0);
  const [nationAlert, setNationAlert] = useState<NationAlert | null>(null);
  const [kesslerLevel, setKesslerLevel] = useState(0);
  const alertIdRef = useRef(0);
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shipPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 25, 0));
  const radarCanvasRef = useRef<HTMLCanvasElement>(null);
  const arrowsRef = useRef<ScreenArrow[]>([]);

  const handleRestart = useCallback(() => {
    meteorPool.forEach(t => { t.active = false; });
    debrisPool.forEach(t => { t.active = false; });
    setGameState({ fuel: 100, velocity: 0, altitude: 25, status: 'playing' });
    setKesslerLevel(0);
    setGameKey(k => k + 1);
  }, []);

  const handleThreatHit = useCallback(() => {
    setGameState(s => s.status === 'playing' ? { ...s, status: 'crashed' } : s);
  }, []);

  const handleNewThreat = useCallback((pos: THREE.Vector3, type: 'meteor' | 'debris') => {
    const alert = makeWarning(pos, type);
    const id = ++alertIdRef.current;
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    setNationAlert({ ...alert, id });
    alertTimerRef.current = setTimeout(() => setNationAlert(null), 6000);
    // Kessler level rises with each new debris/meteor
    setKesslerLevel(k => Math.min(100, k + (type === 'debris' ? 8 : 4)));
  }, []);

  const handleUpdateArrows = useCallback((arrows: ScreenArrow[]) => {
    arrowsRef.current = arrows;
  }, []);

  const score = Math.floor(gameState.fuel * 25);

  return (
    <div className="relative h-full w-full bg-[#050505]">
      {/* Top right */}
      <div className="absolute top-8 right-8 z-50 flex items-center gap-6">
        <ScoreDisplay score={score} />
        <button onClick={handleRestart}
          className="bg-black/80 hover:bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-full shadow-2xl transition-all hover:rotate-180 active:scale-90"
          title="Oyunu Yeniden Başlat (Tuş: R)">
          <RotateCcw className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Top left HUD */}
      <div className="absolute top-8 left-8 z-20 flex flex-col gap-4 pointer-events-none">
        {gameState.onPad && gameState.fuel < 100 && (
          <div className="bg-blue-600/90 backdrop-blur-xl border-2 border-blue-400 p-4 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.6)] animate-pulse">
            <div className="text-white text-base font-bold tracking-[0.2em] text-center">YAKIT İKMALİ...</div>
          </div>
        )}
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-end mb-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Yakıt Rezervi</div>
            <div className="text-xs font-mono text-orange-500">{gameState.fuel.toFixed(0)}%</div>
          </div>
          <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: '100%' }} animate={{ width: `${gameState.fuel}%` }} className="h-full bg-gradient-to-r from-orange-600 to-orange-400" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-2">Hız</div>
            <div className={`text-3xl font-mono tracking-tighter ${gameState.velocity > 6 ? 'text-red-500' : 'text-emerald-500'}`}>
              {gameState.velocity.toFixed(1)} <span className="text-sm opacity-40">m/s</span>
            </div>
          </div>
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-2">İrtifa</div>
            <div className="text-3xl font-mono tracking-tighter text-white">
              {Math.max(0, gameState.altitude).toFixed(1)} <span className="text-sm opacity-40">m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kessler bar — top center */}
      {gameState.status === 'playing' && <KesslerBar level={kesslerLevel} />}

      {/* Nation pre-warning — center top */}
      {gameState.status === 'playing' && <NationAlert alert={nationAlert} />}

      {/* Space facts ticker — bottom left */}
      {gameState.status === 'playing' && <SpaceFactsTicker />}

      {/* Radar — bottom right */}
      <RadarHUD canvasRef={radarCanvasRef} />

      {/* Screen-edge arrow overlay */}
      <ArrowOverlay arrowsRef={arrowsRef} />

      {/* Game over */}
      <AnimatePresence>
        {gameState.status !== 'playing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-2xl">
            <div className="text-center p-12">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 20 }}>
                <h2 className={`text-7xl font-display font-black uppercase tracking-tighter mb-6 ${gameState.status === 'landed' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {gameState.status === 'landed' ? 'GÖREV BAŞARILI' : 'KRİTİK HASAR'}
                </h2>
                <p className="text-white/40 mb-6 max-w-md mx-auto text-lg leading-relaxed">
                  {gameState.status === 'landed'
                    ? 'Kartal iniş yaptı. Ay istasyonuna başarıyla ulaştınız.'
                    : 'Geminiz Ay yörüngesinde parçalandı. Görev başarısız oldu.'}
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

      <ControlsHint />

      <Canvas key={gameKey} shadows dpr={[1, 1.5]} performance={{ min: 0.5 }}>
        <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 100, 50]} intensity={1.5} castShadow shadow-mapSize={[512, 512]} />
        <pointLight position={[-20, 20, 20]} intensity={1.5} color="#4444ff" />

        <Physics gravity={[0, 0, 0]}>
          <MoonGlobe />
          {LANDING_PADS.map(pad => (
            <LandingPad key={pad.angle} angle={pad.angle} label={pad.label} color={pad.color} />
          ))}
          <Spacecraft onUpdate={setGameState} onRestart={handleRestart} shipPosRef={shipPosRef} />
          <ThreatSystem
            shipPosRef={shipPosRef}
            onThreatHit={handleThreatHit}
            onNewThreat={handleNewThreat}
            onUpdateArrows={handleUpdateArrows}
          />
          <RadarRenderer shipPosRef={shipPosRef} radarCanvasRef={radarCanvasRef} />
        </Physics>
      </Canvas>
    </div>
  );
}
