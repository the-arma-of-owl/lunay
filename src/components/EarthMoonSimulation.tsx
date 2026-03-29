import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Line, Stars, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, X } from 'lucide-react';
import * as THREE from 'three';

// Constants for the simulation
const ORBIT_RADIUS = 25;
const EARTH_RADIUS = 3;
const MOON_RADIUS = 1;
const BASE_ORBIT_SPEED = 0.5; // Radians per second for 1x speed

interface Mystery {
  id: string;
  title: string;
  description: string;
  image: string;
}

const MYSTERIES: Mystery[] = [
  { 
    id: 'formation', 
    title: "Oluşumun Sırrı", 
    description: "En güçlü teori olan 'Dev Çarpışma Hipotezi'ne göre, Güneş Sistemi'nin erken dönemlerinde Dünya'ya Mars büyüklüğünde bir cismin çarpmasıyla oluştuğu düşünülmektedir. Ancak her iki gök cisminin kimyasal yapısının izotopik olarak birebir aynı olması, bu teoriyi hala tartışmalı kılmaktadır.", 
    image: "/assets/mysteries/theia_impact.png" 
  },
  { 
    id: 'swirls', 
    title: "Ay Girdapları", 
    description: "Yüzeydeki bu gizemli parlak şekillerin, zayıf yerel manyetik alanların güneş rüzgarlarını saptırması sonucu oluştuğu tahmin ediliyor. Ancak bu manyetik alanların kaynağı (eski lav tünelleri mi, yoksa meteor çarpmaları mı) bilim dünyası için hala kesinleşmiş bir sır değildir.", 
    image: "/assets/mysteries/lunar_swirls.png" 
  },
  { 
    id: 'quakes', 
    title: "Ay Depremleri", 
    description: "Ay ölü bir gök cismi gibi görünse de sismik olarak aktiftir. Ay'ın iç kısmının soğuyup büzülmesiyle yüzeyde kırıklar (faylar) oluştuğu bilinir. Dünya'nın kütleçekim etkisi ve güneşin ısıl genleşmesi de etkili olsa da, bilinen hiçbir mekanizmaya uymayan çok derin sarsıntıların kaynağı hala büyük bir muammadır.", 
    image: "/assets/mysteries/moonquakes.png" 
  },
  { 
    id: 'darkside', 
    title: "Karanlık Yüz", 
    description: "Ay, gelgit kilitlenmesi nedeniyle Dünya'ya her zaman aynı yüzünü gösterir. Göremediğimiz uzak yüz, sanılanın aksine karanlık değildir, Güneş ışığı alır. Ancak uzak yüzün, bize bakan yüze kıyasla çok daha kalın bir kabuğa ve bambaşka bir krater yapısına sahip olmasının kesin nedeni henüz tam olarak aydınlatılamamıştır.", 
    image: "/assets/mysteries/far_side.png" 
  },
  { 
    id: 'ice', 
    title: "Yüzeydeki Su ve Buz", 
    description: "Özellikle kutuplardaki, dibine asla Güneş ışığı vurmayan karanlık kraterlerde donmuş halde su buzu bulunduğuna dair çok güçlü kanıtlar var. Ancak bu suyun Ay'a asteroid ve kuyrukluyıldızlarla mı taşındığı, yoksa Güneş rüzgarlarındaki hidrojenin Ay yüzeyinde reaksiyona mı girdiği kesin bir cevaba kavuşmamıştır.", 
    image: "/assets/mysteries/lunar_ice.png" 
  },
  { 
    id: 'drifting', 
    title: "Uzaklaşan Ay", 
    description: "Lazer yansıtıcı ölçümleri, Ay'ın Dünya'dan her yıl yaklaşık 3.8 cm uzaklaştığını kesin olarak kanıtlıyor. Bu durum Dünya'nın dönüş hızını çok yavaşça düşürmektedir. Uzak gelecekte bu sistemin bir dengeye ulaşması bekleniyor, ancak son durumun nasıl görüneceği konusunda yalnızca matematiksel tahminler yürütebiliyoruz.", 
    image: "/assets/mysteries/drifting_moon.png" 
  }
];

type POV = 'cosmic' | 'mysteries';
type EclipseType = 'solar' | 'lunar' | 'none';

interface SceneProps {
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  timeScale: number;
  setTimeScale: (s: number) => void;
  pov: POV;
  targetAction: EclipseType | null;
  setTargetAction: (a: EclipseType | null) => void;
  setActiveEclipse: (e: EclipseType) => void;
}

const Scene = ({ isPlaying, setIsPlaying, timeScale, setTimeScale, pov, targetAction, setTargetAction, setActiveEclipse }: SceneProps) => {
  const earthRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Group>(null);
  const orbitControlsRef = useRef<any>(null);
  const moonMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const simTime = useRef(0);
  const { camera } = useThree();

  const activeEclipseRef = useRef<EclipseType>('none');
  const targetColor = useRef(new THREE.Color('#ffffff'));

  // Load High-Res Textures for Earth and Moon
  const [earthMap, moonMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'
  ]);
  
  earthMap.colorSpace = THREE.SRGBColorSpace;
  moonMap.colorSpace = THREE.SRGBColorSpace;

  // Generate orbit path points
  const orbitPoints = useMemo(() => {
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * ORBIT_RADIUS, 0, Math.sin(theta) * ORBIT_RADIUS));
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    let speedMultiplier = timeScale;

    // Fast-forward to eclipse target
    if (targetAction) {
      speedMultiplier = 15;
      if (!isPlaying) setIsPlaying(true);
    }

    if (isPlaying) {
      simTime.current += delta * speedMultiplier;
    }

    const angle = simTime.current * BASE_ORBIT_SPEED;
    const currentAngleMod = angle % (Math.PI * 2);

    // Stop at Target Eclipse (Hizalanmayı yakala)
    const HIT_TOLERANCE = 0.05;
    if (targetAction === 'solar' && (currentAngleMod < HIT_TOLERANCE || currentAngleMod > Math.PI * 2 - HIT_TOLERANCE)) {
      setTargetAction(null);
      setTimeScale(0.2); // Slow motion over the eclipse
    } else if (targetAction === 'lunar' && Math.abs(currentAngleMod - Math.PI) < HIT_TOLERANCE) {
      setTargetAction(null);
      setTimeScale(0.2); // Slow motion over the eclipse
    }

    // Eclipse Detection Zone
    const ECLIPSE_TOLERANCE = 0.3; // Yaklaşık tutulma aralığı
    let currentEclipse: EclipseType = 'none';
    if (currentAngleMod < ECLIPSE_TOLERANCE || currentAngleMod > Math.PI * 2 - ECLIPSE_TOLERANCE) {
      currentEclipse = 'solar'; // Güneş Tutulması
    } else if (Math.abs(currentAngleMod - Math.PI) < ECLIPSE_TOLERANCE) {
      currentEclipse = 'lunar'; // Ay Tutulması
    }

    if (currentEclipse !== activeEclipseRef.current) {
      activeEclipseRef.current = currentEclipse;
      setActiveEclipse(currentEclipse);
    }

    // Blood Moon (Kanlı Ay) Effect Lerp
    if (moonMatRef.current) {
      if (currentEclipse === 'lunar') {
        // Derin kan kırmızısı/koyu bakır rengi
        targetColor.current.set('#6a1a00'); 
      } else {
        targetColor.current.set('#ffffff');
      }
      moonMatRef.current.color.lerp(targetColor.current, 0.05);
    }

    if (earthRef.current && isPlaying) {
      // Dünyanın dönüş hissini net hissetmek için stabil rotasyon çarpanı.
      earthRef.current.rotation.y += delta * speedMultiplier * 2.0;
    }

    if (moonRef.current) {
      // Position the moon
      const x = Math.cos(angle) * ORBIT_RADIUS;
      const z = Math.sin(angle) * ORBIT_RADIUS;
      moonRef.current.position.set(x, 0, z);

      // Tidal locking
      moonRef.current.rotation.y = -angle + Math.PI; 
    }

    // Camera POV Logic
    if (pov === 'cosmic') {
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
    } else {
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
      
      const targetPos = new THREE.Vector3();
      const lookTarget = new THREE.Vector3();
      
      if (pov === 'mysteries' && moonRef.current) {
        // CLOSE-UP ZOOM: Ay'ın gizemlerine odaklanan yakın çekim.
        const dirToEarth = moonRef.current.position.clone().normalize().negate();
        targetPos.copy(moonRef.current.position).add(dirToEarth.clone().multiplyScalar(-6)); 
        targetPos.y = 1.5; 
        lookTarget.copy(moonRef.current.position); 
      }

      camera.position.lerp(targetPos, 0.04);
      const dummyObj = new THREE.Object3D();
      dummyObj.position.copy(camera.position);
      dummyObj.lookAt(lookTarget);
      camera.quaternion.slerp(dummyObj.quaternion, 0.06);
    }
  });

  return (
    <group>
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />

      <ambientLight intensity={0.05} />
      
      {/* High-Resolution Shadow Map for true Eclipse casting on Earth */}
      <directionalLight position={[200, 0, 0]} intensity={3.5} color="#fffcf5" castShadow shadow-mapSize={[4096, 4096]}>
        <orthographicCamera attach="shadow-camera" args={[-40, 40, 40, -40, 0.1, 500]} />
        <mesh>
          <sphereGeometry args={[1, 1, 1]}/>
          <meshBasicMaterial color="yellow" visible={false} />
        </mesh>
      </directionalLight>
      
      {/* Earth Shine ambient effect */}
      <pointLight position={[0, 0, 0]} intensity={0.1} color="#60a5fa" distance={50} />

      <Line
        points={orbitPoints}
        color="#ffffff"
        lineWidth={1.5}
        transparent
        opacity={0.15}
        dashed
        dashScale={5}
        dashSize={0.5}
        gapSize={0.2}
      />

      <group position={[0, 0, 0]}>
        <group ref={earthRef}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
            <meshStandardMaterial map={earthMap} color="#ffffff" roughness={0.5} metalness={0.1} />
          </mesh>
          {/* Atmosfer (Mavi Korona) */}
          <mesh>
            <sphereGeometry args={[EARTH_RADIUS * 1.05, 32, 32]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
        
        {/* Dünya Gölge Konisi (Umbra) */}
        <mesh position={[-25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[EARTH_RADIUS * 0.98, 50, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.5} depthWrite={false} />
        </mesh>
      </group>

      <group ref={moonRef}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[MOON_RADIUS, 64, 64]} />
          {/* moonMatRef allows altering color to Blood Moon physically */}
          <meshStandardMaterial ref={moonMatRef} map={moonMap} color="#ffffff" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Kırmızı Nokta */}
        <mesh position={[0, 0, MOON_RADIUS + 0.02]} rotation={[Math.PI / 2, 0, 0]} renderOrder={1}>
          <circleGeometry args={[0.15, 16]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.6} depthTest={false} />
        </mesh>
      </group>

      {/* Ay Gölge Konisi - Daima güneşe (-X) zıt yönde */}
      <ShadowCones moonRef={moonRef} />

      <OrbitControls 
        ref={orbitControlsRef} 
        enablePan={true} 
        minDistance={10} 
        maxDistance={150} 
        maxPolarAngle={Math.PI / 2 + 0.5}
      />
    </group>
  );
};

// Ay Gölgesini yönetir
const ShadowCones = ({ moonRef }: { moonRef: React.RefObject<THREE.Group> }) => {
  const moonShadowRef = useRef<THREE.Mesh>(null);
  const coneLength = 20;
  
  useFrame(() => {
    if (moonRef.current && moonShadowRef.current) {
      moonShadowRef.current.position.copy(moonRef.current.position);
      moonShadowRef.current.position.x -= (coneLength / 2);
    }
  });

  return (
    <mesh ref={moonShadowRef} rotation={[0, 0, Math.PI / 2]}>
      <coneGeometry args={[MOON_RADIUS * 0.98, coneLength, 32]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.6} depthWrite={false} />
    </mesh>
  );
};

export default function EarthMoonSimulation({ onExit }: { onExit: () => void }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [pov, setPov] = useState<POV>('cosmic');
  const [timeScale, setTimeScale] = useState(1);
  const [activeEclipse, setActiveEclipse] = useState<EclipseType>('none');
  const [targetAction, setTargetAction] = useState<EclipseType | null>(null);
  const [selectedMysteryId, setSelectedMysteryId] = useState<string | null>(null);

  return (
    <div className="relative h-full w-full bg-[#050505] font-sans">
      
      {/* Devam Ediyor Eclipse Pop-up (Ekran Ortası / Üstü) */}
      <AnimatePresence>
        {activeEclipse !== 'none' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className={`px-8 py-4 rounded-full border shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center gap-4 ${
              activeEclipse === 'solar' 
                ? 'bg-amber-500/10 border-amber-500/50 text-amber-100' 
                : 'bg-red-500/10 border-red-500/50 text-red-100'
            }`}>
              <div className={`w-3 h-3 rounded-full animate-ping ${activeEclipse === 'solar' ? 'bg-amber-400' : 'bg-red-500'}`} />
              <div className="font-display font-black tracking-widest uppercase text-lg">
                Tam {activeEclipse === 'solar' ? 'Güneş' : 'Ay (Kanlı Ay)'} Tutulması!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 p-8 flex items-center justify-between pointer-events-none">
        <button
          onClick={onExit}
          className="pointer-events-auto px-4 py-2 bg-black/50 border border-white/10 rounded-full flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm uppercase tracking-widest font-bold">Geri Dön</span>
        </button>
      </div>

      {/* TtutuLMA CONTROLS (Left side under header) */}
      <div className="absolute top-24 left-8 z-50 flex flex-col gap-3 pointer-events-auto">
        <div className="text-xs uppercase tracking-widest text-white/50 font-bold mb-1">Eğitim Modülleri</div>
        <button
          onClick={() => setTargetAction('solar')}
          disabled={targetAction !== null}
          className="px-6 py-4 bg-gradient-to-r from-amber-600/90 to-amber-700/90 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-900/20 w-64 text-left border border-amber-400/30"
        >
          Güneş Tutulması Simülasyonu
        </button>
        <button
          onClick={() => setTargetAction('lunar')}
          disabled={targetAction !== null}
          className="px-6 py-4 bg-gradient-to-r from-red-800/90 to-red-900/90 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-red-900/20 w-64 text-left border border-red-500/30"
        >
          Ay Tutulması (Blood Moon)
        </button>

        {targetAction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mt-2 animate-pulse">
            Hedefe İlerleniyor, Lütfen Bekleyin...
          </motion.div>
        )}

        <div className="mt-8">
          <button
            onClick={() => {
              setPov('mysteries');
              setIsPlaying(true);
              setTimeScale(0.2);
            }}
            className="px-6 py-5 bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 hover:from-indigo-500 hover:to-purple-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] w-64 text-left border border-indigo-400/30 flex items-center justify-between group"
          >
            <span>Ay'ın Gizemleri ve Sırları</span>
            <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:animate-ping" />
          </button>
        </div>
      </div>

      {/* Info Panels */}
      <div className="absolute bottom-24 left-8 z-20 w-[300px] pointer-events-none">
        <div className="bg-black/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-white shadow-2xl">
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#60a5fa] mb-1">Gelgit Kilitlenmesi</h2>
            <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-wider">
              Kırmızı nokta Ay'ın daima Dünya'ya bakan yüzünü temsil eder. Senkron dönüş nedeniyle bu yüz asla değişmez.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#ef4444] mb-1">Gölge Konileri (Umbra)</h2>
            <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-wider">
              Nesnelerin arkasındaki karanlık izler gölge konileridir. Ay Dünya'nın konisine girdiğinde Ay Tutulması yaşanır.
            </p>
          </div>
        </div>
      </div>

      {/* Time & Speed Controls (Top Right) */}
      <div className="absolute top-24 right-8 z-50 flex flex-col items-end gap-3 pointer-events-auto">
        <div className="bg-black/50 backdrop-blur-xl px-4 py-3 rounded-xl border border-white/10 text-white shadow-2xl flex items-center justify-center">
           <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-400">
             Hız: {timeScale === 1 ? 'Gerçek Zamanlı' : timeScale === 0.2 ? 'Ağır Çekim İzleme' : timeScale + 'x Hızlandırılmış'}
           </div>
        </div>
        
        <div className="flex bg-black/50 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-2xl">
          {[0.2, 1, 5, 10].map((speed) => (
            <button
              key={speed}
              onClick={() => { setTimeScale(speed); setTargetAction(null); }}
              className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all uppercase tracking-widest ${
                timeScale === speed 
                  ? 'bg-white text-black' 
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* POV & Playback Controls (Bottom) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-6 pointer-events-auto">
        
        {/* POV Buttons */}
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full p-1.5 shadow-2xl">
          {[
            { id: 'cosmic', label: "🌌 Kozmik Bakış" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setPov(mode.id as POV)}
              className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${
                pov === mode.id 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/20'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={() => { setIsPlaying(!isPlaying); setTargetAction(null); }}
          className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/20 transition-all flex items-center justify-center gap-2"
        >
          {isPlaying ? (
            <><span className="w-2 h-2 bg-red-500 rounded-sm animate-pulse" /> Duraklat</>
          ) : (
            <><span className="w-0 h-0 border-t-4 border-t-transparent border-l-[6px] border-l-emerald-500 border-b-4 border-b-transparent" /> Devam Et</>
          )}
        </button>

        {/* Mysteries Content Overlay */}
        <AnimatePresence>
          {pov === 'mysteries' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-4xl px-4"
            >
              <div className="bg-black/80 backdrop-blur-2xl border border-white/20 p-8 rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,0.8)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MYSTERIES.map((item, i) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedMysteryId(item.id)}
                      className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 p-5 rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                          <span className="w-1.5 h-1.5 bg-amber-400 group-hover:bg-indigo-400 rounded-full transition-colors" /> {item.title}
                        </h3>
                        <p className="text-white/60 text-[11px] leading-relaxed uppercase tracking-wider font-medium group-hover:text-white transition-colors line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                        <span className="text-indigo-500/0 group-hover:text-indigo-400 text-[9px] font-bold uppercase tracking-[0.3em] transition-all transform translate-x-4 group-hover:translate-x-0">
                          Derinlemesine İncele &rarr;
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Magnifying Glass Detail Modal */}
        <AnimatePresence>
          {selectedMysteryId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-5xl bg-black border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.2)] flex flex-col md:flex-row h-[80vh] md:h-auto"
              >
                <button 
                  onClick={() => setSelectedMysteryId(null)}
                  className="absolute top-6 right-6 z-20 w-12 h-12 bg-black/50 hover:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/50 hover:text-white border border-white/20 transition-all hover:scale-110"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="md:w-3/5 h-[40vh] md:h-[60vh] relative overflow-hidden group">
                  <img 
                    src={MYSTERIES.find(m => m.id === selectedMysteryId)?.image} 
                    alt="Mystery Detail" 
                    className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>
                
                <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-slate-900 to-black relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-indigo-500" /> Gizem Çözümleniyor
                    </div>
                    <h2 className="text-3xl md:text-5xl font-light text-white mb-6 leading-tight">
                      {MYSTERIES.find(m => m.id === selectedMysteryId)?.title}
                    </h2>
                    <p className="text-white/70 text-sm md:text-base leading-relaxed tracking-wide font-light">
                      {MYSTERIES.find(m => m.id === selectedMysteryId)?.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simulation Engine */}
      <Canvas shadows={{ type: THREE.PCFShadowMap }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 40, 50]} fov={45} />
        <Suspense fallback={null}>
          <Scene 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying}
            timeScale={timeScale} 
            setTimeScale={setTimeScale}
            pov={pov} 
            targetAction={targetAction}
            setTargetAction={setTargetAction}
            setActiveEclipse={setActiveEclipse}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
