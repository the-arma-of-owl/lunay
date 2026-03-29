import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, Activity, Wifi } from 'lucide-react';

type Phase = 'INPUT' | 'COLLECTING' | 'LAUNCHING' | 'JOURNEY';
const SPEED_OF_LIGHT = 299792.458; // km/s
const DISTANCE_TO_MOON = 384400; // km

interface Milestone {
  name: string;
  distanceKm: number;
  description: string;
}

const MILESTONES: Milestone[] = [
  { name: "Ay", distanceKm: 384400, description: "Dünya'nın uydusu" },
  { name: "Apollo 13", distanceKm: 400171, description: "İnsanlı uçuş rekoru" },
  { name: "Parker Solar Probe", distanceKm: 6000000, description: "Güneş'e en yakın araç" },
  { name: "Güneş", distanceKm: 149600000, description: "Sistemimizin yıldızı (1 AU)" },
  { name: "Mars", distanceKm: 225000000, description: "Kızıl Gezegen" },
  { name: "Jüpiter", distanceKm: 778000000, description: "Gaz Devi" },
  { name: "Neptün", distanceKm: 4500000000, description: "Güneş sisteminin son gezegeni" },
  { name: "New Horizons", distanceKm: 9000000000, description: "Plüton ve Kuiper Kuşağı" },
  { name: "Heliopause", distanceKm: 18000000000, description: "Güneş rüzgarının bittiği sınır" },
  { name: "Pioneer 10", distanceKm: 19000000000, description: "İletişim kopan derin uzay aracı" },
  { name: "Voyager 2", distanceKm: 20000000000, description: "Yıldızlararası uzaya giren 2. araç" },
  { name: "Voyager 1", distanceKm: 24000000000, description: "İnsan yapımı en uzak nesne" },
  { name: "Oort Bulutu", distanceKm: 300000000000, description: "Kuyruklu yıldızların kaynağı" },
  { name: "Proxima Centauri", distanceKm: 40110000000000, description: "En yakın yıldız (4.24 Işık Yılı)" },
  { name: "Samanyolu Merkezi", distanceKm: 245000000000000000, description: "Süper kütleli kara delik" },
  { name: "Samanyolu Çapı", distanceKm: 946000000000000000, description: "100,000 Işık Yılı" },
  { name: "Andromeda Galaksisi", distanceKm: 23650000000000000000, description: "2.5 Milyon Işık Yılı" },
  { name: "GN-z11 / HD1", distanceKm: 127700000000000000000000, description: "13.5 Milyar Işık Yılı" },
  { name: "Kozmik Arka Plan", distanceKm: 435000000000000000000000, description: "Gözlemlenebilir evren sınırı (46 Milyar Işık Yılı)" }
];

const formatETA = (distanceKm: number, currentDistance: number) => {
  const remainingKm = distanceKm - currentDistance;
  if (remainingKm <= 0) return "Ulaşıldı";
  
  const sec = remainingKm / SPEED_OF_LIGHT;
  if (sec < 60) return `${sec.toFixed(1)} Sn`;
  if (sec < 3600) return `${(sec / 60).toFixed(1)} Dk`;
  if (sec < 86400) return `${(sec / 3600).toFixed(1)} Saat`;
  if (sec < 31536000) return `${(sec / 86400).toFixed(1)} Gün`;
  
  const yrs = sec / 31536000;
  if (yrs > 1000000000) return `${(yrs / 1000000000).toFixed(1)} Milyar Yıl`;
  if (yrs > 1000000) return `${(yrs / 1000000).toFixed(1)} Milyon Yıl`;
  if (yrs > 1000) return `${(yrs / 1000).toFixed(1)} Bin Yıl`;
  return `${yrs.toFixed(1)} Yıl`;
};

interface EternityJourneyProps {
  onExit: () => void;
}

export default function EternityJourney({ onExit }: EternityJourneyProps) {
  const [phase, setPhase] = useState<Phase>('INPUT');
  const [textInput, setTextInput] = useState('Umut\nKeşif\nBarış\nBilim\nGelecek\nİnsanlık\nMiras');
  const [words, setWords] = useState<string[]>([]);
  
  // Parametric journey state
  const [distance, setDistance] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (phase === 'JOURNEY') {
      startTimeRef.current = performance.now();
      const animateDistance = (time: number) => {
        if (!startTimeRef.current) return;
        const elapsedSeconds = (time - startTimeRef.current) / 1000;
        setDistance(elapsedSeconds * SPEED_OF_LIGHT);
        requestRef.current = requestAnimationFrame(animateDistance);
      };
      requestRef.current = requestAnimationFrame(animateDistance);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [phase]);

  const handleStart = () => {
    try {
      const parsed = textInput.split('\n').map(word => word.trim()).filter(word => word.length > 0);
      if (parsed.length > 0) {
        setWords(parsed);
        setPhase('COLLECTING');
        
        // Calculate dynamic timing based on word count
        // Each word delay: 1 + (i * 0.3) seconds. Duration: 2.5 seconds.
        const totalAnimationTimeS = 1 + ((parsed.length - 1) * 0.3) + 2.5;
        const launchTimeMs = totalAnimationTimeS * 1000 + 400; // 400ms buffer after all words collected
        
        // Timeline transitions
        setTimeout(() => setPhase('LAUNCHING'), launchTimeMs);
        setTimeout(() => setPhase('JOURNEY'), launchTimeMs + 1500);
      } else {
        alert("Lütfen en az bir kelime veya mesaj girin!");
      }
    } catch (e) {
      alert("Bir hata oluştu!");
    }
  };

  return (
    <div className="relative w-full h-full bg-[#030305] text-white overflow-hidden font-sans">
      
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <button
          onClick={onExit}
          className="px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full flex items-center gap-3 text-white/50 hover:text-white transition-all hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-xs uppercase tracking-[0.2em] font-bold">Menüye Dön</span>
        </button>
      </div>

      <AnimatePresence mode="sync">
        {/* PHASE 1: INPUT */}
        {phase === 'INPUT' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20"
          >
            <div className="max-w-2xl w-full">
              <div className="text-center mb-10">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                  className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-6"
                >
                  <Wifi className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Derin Uzay İletişim Terminali</span>
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-display font-light tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Sonsuzluğa Mesaj
                </h1>
                <p className="text-white/60 font-light tracking-wide text-sm md:text-base leading-relaxed px-4">
                  Sözcüklerinizi yüksek enerjili bir elektromanyetik sinyale dönüştürüp derin uzaya göndereceğiz. Beklenen hız: <span className="font-mono text-emerald-400">299.792 km/s</span>. Hedef: Ay ve Ötesi.
                </p>
              </div>

              <div className="relative group mx-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-black/80 border border-white/20 rounded-3xl overflow-hidden backdrop-blur-2xl">
                  <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">mesaj.txt</span>
                  </div>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full h-48 md:h-64 bg-transparent text-emerald-400 font-mono text-sm md:text-base p-8 outline-none resize-none leading-relaxed"
                    spellCheck="false"
                  />
                </div>
              </div>

              <div className="mt-12 text-center">
                <button
                  onClick={handleStart}
                  className="px-10 py-5 bg-white text-black rounded-full font-black text-xs md:text-sm uppercase tracking-[0.3em] hover:bg-indigo-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(99,102,241,0.6)] flex items-center gap-3 mx-auto group"
                >
                  Kapsülle ve Fırlat <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Elegant Background Grid for Input */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none -z-10" />
          </motion.div>
        )}

        {/* PHASE 2: COLLECTING */}
        {phase === 'COLLECTING' && (
          <motion.div
            key="collecting"
            className="absolute inset-0 z-30"
          >
            {/* Center Core Box/Orb */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1, 1.1, 1], 
                opacity: 1,
                boxShadow: ["0 0 0px #fff", "0 0 150px #6366f1", "0 0 80px #8b5cf6"]
              }}
              transition={{ duration: 1.5, times: [0, 0.4, 0.7, 0.9, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-[2rem] bg-white flex items-center justify-center z-10 rotate-45"
            >
              <div className="-rotate-45 text-black font-black text-[10px] tracking-[0.4em] uppercase opacity-80">
                Sinyalize
              </div>
              <div className="absolute inset-0 rounded-[2rem] border-2 border-indigo-400 animate-ping opacity-50" />
            </motion.div>

            {/* Flying JSON Words Particles */}
            {words.map((word, i) => {
              const angle = (i / words.length) * Math.PI * 2;
              const radius = window.innerWidth > window.innerHeight ? window.innerWidth * 0.45 : window.innerHeight * 0.45;
              const startX = Math.cos(angle) * radius;
              const startY = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={i}
                  initial={{ x: startX, y: startY, opacity: 0, scale: 2 }}
                  animate={{ 
                    x: 0, 
                    y: 0, 
                    opacity: [0, 1, 1, 0],
                    scale: [2, 1, 0.5, 0],
                    filter: ["blur(0px)", "blur(0px)", "blur(5px)", "blur(15px)"]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    delay: 1 + (i * 0.3), 
                    ease: "backIn" 
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-4xl lg:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-purple-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.8)] pointer-events-none z-20 whitespace-nowrap"
                >
                  {word}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* PHASE 3 & 4: LAUNCHING & JOURNEY */}
        {(phase === 'LAUNCHING' || phase === 'JOURNEY') && (
          <motion.div
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 bg-black flex justify-center items-center overflow-hidden"
          >
            {/* Warp Speed Stars Background */}
            <div className="absolute inset-0 pointer-events-none opacity-80" style={{ perspective: '800px' }}>
              {[...Array(150)].map((_, i) => {
                const isJourney = phase === 'JOURNEY';
                return (
                  <motion.div
                    key={i}
                    className="absolute w-[2px] h-32 bg-white/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-20%',
                    }}
                    animate={{
                      y: ['0vh', '150vh'],
                      opacity: [0, 1, 0],
                      scaleY: isJourney ? [1, 5, 1] : 1
                    }}
                    transition={{
                      duration: isJourney ? (0.1 + Math.random() * 0.3) : (0.5 + Math.random()), 
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "linear"
                    }}
                  />
                );
              })}
            </div>

            {/* Central Electromagnetic Beam Animation */}
            <motion.div
              initial={phase === 'LAUNCHING' ? { 
                scale: 1, 
                width: "200px", 
                height: "200px", 
                borderRadius: "32px",
                rotate: 45
              } : {}}
              animate={phase === 'LAUNCHING' ? {
                scale: [1, 0.5, 20],
                width: "20px",
                height: "200vh",
                borderRadius: "0px",
                rotate: 0,
                backgroundColor: "#ffffff",
                boxShadow: "0 0 200px #ffffff, 0 0 400px #8b5cf6"
              } : {
                width: "8px",
                height: "100vh",
                backgroundColor: "#ffffff",
                boxShadow: "0 0 50px #ffffff, 0 0 100px #3b82f6",
                rotate: 0
              }}
              transition={phase === 'LAUNCHING' ? { 
                duration: 1.5, 
                ease: "circIn" 
              } : { duration: 0.5 }}
              className="absolute pointer-events-none z-20"
            />

            {/* Roadmap Panel (Displays in phase 4) */}
            {phase === 'JOURNEY' && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute left-6 md:left-8 lg:left-12 top-24 bottom-48 w-[calc(100%-3rem)] md:w-80 lg:w-96 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 flex flex-col z-40 shadow-[0_0_80px_rgba(0,0,0,0.5)]"
              >
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-[0.4em] mb-4 pb-4 border-b border-white/10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" /> Sinyal Rotası & Hedefler
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {MILESTONES.map((milestone, i) => {
                    const passed = distance >= milestone.distanceKm;
                    return (
                      <div key={i} className={`flex flex-col p-4 rounded-xl border ${passed ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5'} transition-all duration-500`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-sm font-bold ${passed ? 'text-indigo-300' : 'text-white'}`}>{milestone.name}</span>
                          <span className={`text-[10px] uppercase tracking-wider ${passed ? 'text-emerald-400 font-bold' : 'text-white/40'}`}>
                            {passed ? 'Ulaşıldı' : formatETA(milestone.distanceKm, distance)}
                          </span>
                        </div>
                        <div className="text-xs text-white/50 leading-relaxed">{milestone.description}</div>
                        <div className="text-[9px] text-white/30 font-mono mt-2 tracking-widest">{milestone.distanceKm.toLocaleString('tr-TR')} KM</div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Telemetry HUD (Displays in phase 4) */}
            {phase === 'JOURNEY' && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute bottom-12 w-[90%] max-w-4xl bg-black/50 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between shadow-[0_0_80px_rgba(0,0,0,0.8)] z-50"
              >
                <div className="w-full mb-6 md:mb-0">
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-[0.4em] flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-emerald-400" /> Sinyal Telemetri Verisi
                  </div>
                  <div className="text-emerald-400 font-mono text-4xl lg:text-6xl tracking-tighter shrink-0 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                    {distance.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} <span className="text-xl lg:text-2xl opacity-50 font-sans tracking-widest">KM</span>
                  </div>
                  <div className="text-xs text-white/40 font-mono mt-3 w-full border-t border-white/10 pt-3 uppercase tracking-widest">
                    Hız: 299.792 km/s (Işık Hızı C)
                  </div>
                </div>

                <div className="w-full md:text-right flex flex-col md:items-end">
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-[0.4em] mb-2 border-b border-white/10 pb-2 inline-block">
                    Tahmini Hedef Menzili
                  </div>
                  
                  {distance < DISTANCE_TO_MOON ? (
                    <motion.div className="text-white font-black text-3xl lg:text-5xl tracking-wide uppercase mt-2">
                       Ay LUNA
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="deepspace"
                      initial={{ opacity: 0, scale: 0.8, color: '#fff' }}
                      animate={{ opacity: 1, scale: 1, color: '#a78bfa' }}
                      className="font-black text-3xl lg:text-5xl tracking-widest uppercase mt-2 drop-shadow-[0_0_20px_rgba(167,139,250,0.8)]"
                    >
                      Derin Uzay
                    </motion.div>
                  )}
                  
                  <div className="text-sm text-indigo-300/80 mt-3 uppercase font-mono tracking-widest">
                    {distance < DISTANCE_TO_MOON 
                      ? `Ay'a Varış: ${((DISTANCE_TO_MOON - distance) / SPEED_OF_LIGHT).toFixed(3)} Sn`
                      : "Sonsuzluğa İlerliyor..."}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Cinematic Overlay Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-30" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
