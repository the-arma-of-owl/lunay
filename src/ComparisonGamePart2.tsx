import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";
import confetti from "canvas-confetti";

interface ComparisonGamePart2Props {
  onExit: () => void;
}

const TRUE_MOON_SCALE = 0.2726; // Gerçek Dünya-Ay yarıçap oranı

// Doku yükleyici
function PlanetSphere({ 
  url, 
  radius, 
  position, 
  scale = 1, 
  opacity = 1, 
  transparent = false,
  autoRotate = false
}: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // useTexture Suspense ile çalışır, yüklenene kadar bekler.
  const texture = useTexture(url) as THREE.Texture;

  useFrame(() => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Sphere ref={meshRef} args={[radius, 64, 64]} position={position} scale={scale}>
      <meshStandardMaterial 
        map={texture} 
        color="#ffffff"
        transparent={transparent}
        opacity={opacity}
        roughness={0.6}
        metalness={0.1}
      />
    </Sphere>
  );
}

export default function ComparisonGamePart2({ onExit }: ComparisonGamePart2Props) {
  const [userScale, setUserScale] = useState<number>(0.5);
  const [submitted, setSubmitted] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const handleSubmit = () => {
    // Doğruluk hesaplama:
    // Hata = |Tahmin - Gerçek| / Gerçek
    const error = Math.abs(userScale - TRUE_MOON_SCALE) / TRUE_MOON_SCALE;
    
    // Doğruluk Yüzdesi = 100 - (Hata * 100)
    let acc = 100 - (error * 100);
    acc = Math.max(0, Math.min(100, Math.round(acc)));
    
    setAccuracy(acc);
    setSubmitted(true);

    if (acc > 90) {
      triggerConfetti();
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setAccuracy(null);
    setUserScale(0.5);
  };

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <div className="relative h-full w-full flex flex-col bg-black text-white font-sans overflow-hidden">
      {/* Üst Kısım Menüsü */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 md:p-8 flex items-center justify-between pointer-events-none">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm uppercase tracking-widest hidden md:inline">Menüye Dön</span>
        </button>
        <div className="text-white/80 font-display text-xl tracking-widest bg-black/50 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
          Boyut Kıyaslaması
        </div>
      </div>

      {/* 3D Kısım */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 3, 5]} intensity={1.5} />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          
          <Suspense fallback={null}>
            {/* Dünya Modeli (Sol Taraf) */}
            <PlanetSphere 
              url="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg" 
              radius={1.2} 
              position={[-1.5, 0, 0]} 
              autoRotate={true}
            />

            {/* Kullanıcının Tahmin Ettiği Ay (Sağ Taraf) */}
            <PlanetSphere 
              url="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg" 
              radius={1.2}
              scale={userScale}
              position={[1.5, 0, 0]} 
              autoRotate={true}
              transparent={submitted}
              opacity={submitted ? 0.3 : 1}
            />

            {/* Gerçek Ay (Sadece sonuç ekranında şeffaf Ay ile iç içe görünür) */}
            {submitted && (
              <PlanetSphere 
                url="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg" 
                radius={1.2}
                scale={TRUE_MOON_SCALE}
                position={[1.5, 0, 0]} 
                autoRotate={true}
              />
            )}
          </Suspense>

          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* UI Katmanı */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-12 pt-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
        
        <div className="w-full max-w-2xl px-6 flex flex-col items-center gap-6 pointer-events-auto">
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div 
                key="controls"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col items-center gap-6"
              >
                <div className="text-center mb-2">
                  <h3 className="text-2xl font-display mb-2">Ay'ın Boyutunu Ayarla</h3>
                  <p className="text-white/60 text-sm">Aşağıdaki çubuğu kaydırarak Ay'ın Dünya'ya kıyasla gerçekte ne kadar büyük olduğunu tahmin et.</p>
                </div>
                
                {/* Slider */}
                <div className="w-full flex items-center gap-4">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Küçük</span>
                  <input 
                    type="range" 
                    min="0.05" 
                    max="1" 
                    step="0.001" 
                    value={userScale}
                    onChange={(e) => setUserScale(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-green-400"
                  />
                  <span className="text-xs text-white/50 uppercase tracking-widest">Büyük</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="mt-4 px-12 py-4 bg-white text-black rounded-full font-medium tracking-widest uppercase"
                >
                  Tamamla
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center text-center gap-4"
              >
                <h3 className="text-3xl font-display">
                  Sizin Doğruluğunuz: <span className={accuracy && accuracy > 80 ? "text-green-400" : accuracy && accuracy > 50 ? "text-yellow-400" : "text-red-400"}>%{accuracy}</span>
                </h3>
                
                <p className="text-white/70 mt-2 max-w-md">
                  Sağdaki şeffaf gölge senin tahminini, içindeki net küre ise <strong>gerçek Ay boyutunu</strong> gösteriyor.
                </p>

                <div className="flex gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="px-8 py-3 bg-white/10 border border-white/20 hover:bg-white/20 rounded-full font-medium tracking-widest uppercase flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Tekrar Dene
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>

    </div>
  );
}
