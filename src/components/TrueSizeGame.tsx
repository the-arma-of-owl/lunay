import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Info } from "lucide-react";

interface TrueSizeGameProps {
  onExit: () => void;
}

// Görseller: Lütfen sen kendi projenin `public` veya `src/assets` klasörüne asıl görselleri eklediğinde buradaki linkleri güncelle.
const WATERMELON_IMG = "https://images.unsplash.com/photo-1563114773-84221bd62bf3?auto=format&fit=crop&q=80&w=400&h=400";
const ORANGE_IMG = "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&q=80&w=300&h=300";
const PEACH_IMG = "https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&q=80&w=300&h=300";
const MELON_IMG = "https://images.unsplash.com/photo-1571575173700-afb6027bd405?auto=format&fit=crop&q=80&w=300&h=300";

const SKYSCRAPER_IMG = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300&h=300";
const APARTMENT_IMG = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=300&h=300";
const HOUSE_IMG = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=300&h=300";

const EARTH_IMG = "https://upload.wikimedia.org/wikipedia/commons/2/22/Earth_Western_Hemisphere_transparent_background.png";
const MOON_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/600px-FullMoon2010.jpg";
const VESTA_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Vesta_in_natural_color_%28cropped%29.jpg/600px-Vesta_in_natural_color_%28cropped%29.jpg";
const PSYCHE_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Asteroid_Psyche.png/600px-Asteroid_Psyche.png";

const OPTIONS_STAGE_1 = [
  { id: "melon", name: "Kavun", img: MELON_IMG },
  { id: "orange", name: "Portakal", img: ORANGE_IMG, correct: true },
  { id: "peach", name: "Şeftali", img: PEACH_IMG },
  { id: "apartment", name: "Apartman", img: APARTMENT_IMG },
];

export default function TrueSizeGame({ onExit }: TrueSizeGameProps) {
  const [mode, setMode] = useState<"quiz1" | "success1" | "info2" | "drag">("quiz1");
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  
  const [isEarthInZone, setIsEarthInZone] = useState(false);
  const [isMoonInZone, setIsMoonInZone] = useState(false);
  const [isVestaInZone, setIsVestaInZone] = useState(false);
  const [isPsycheInZone, setIsPsycheInZone] = useState(false);
  
  const handleSelect1 = (option: typeof OPTIONS_STAGE_1[0]) => {
    if (option.correct) {
      setMode("success1");
      setTimeout(() => {
        setMode("info2");
      }, 4000);
    } else {
      if (!wrongAnswers.includes(option.id)) {
        setWrongAnswers(prev => [...prev, option.id]);
      }
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col bg-black text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm uppercase tracking-widest">Geri Dön</span>
        </button>
        <div className="text-xl font-display tracking-tighter">
          <span className="font-bold">Gerçek Boyut</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === "quiz1" || mode === "success1" ? (
          <motion.div 
            key="quiz1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 space-y-12"
          >
            <div className="text-center max-w-2xl mt-12">
              <h2 className="text-3xl md:text-5xl font-light mb-6">Eğer Dünya bir <span className="text-green-400 font-semibold">Karpuz</span> büyüklüğünde olsaydı...</h2>
              <p className="text-lg md:text-xl text-white/60 mb-8">Sizce Ay aşağıda verilen meyvelerden hangisi olurdu?</p>
              
              <motion.div 
                className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/10 mx-auto mb-12 shadow-[0_0_50px_rgba(74,222,128,0.2)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
              >
                <img src={WATERMELON_IMG} alt="Dünya (Karpuz)" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            {mode === "quiz1" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
                {OPTIONS_STAGE_1.map(opt => {
                  const isWrong = wrongAnswers.includes(opt.id);
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleSelect1(opt)}
                      animate={isWrong ? { x: [-10, 10, -10, 10, 0], opacity: 0.3 } : {}}
                      transition={{ duration: 0.4 }}
                      disabled={isWrong}
                      whileHover={!isWrong ? { scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" } : {}}
                      whileTap={!isWrong ? { scale: 0.95 } : {}}
                      className={`flex flex-col items-center p-4 rounded-xl border ${isWrong ? 'border-red-500/30 bg-red-500/10' : 'border-white/20 bg-white/5'} transition-all`}
                    >
                      <div className="w-24 h-24 mb-4 rounded-full overflow-hidden">
                        <img src={opt.img} alt={opt.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-lg font-light tracking-wide">{opt.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center bg-green-500/20 border border-green-500/40 p-10 rounded-2xl max-w-2xl"
              >
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-3xl font-bold text-green-400 mb-4">Tebrikler! Doğru Bildiniz!</h3>
                <p className="text-center text-lg text-white/80 leading-relaxed font-light">
                  Dünya'nın çapı (~12.742 km) Ay'ın çapının (~3.474 km) yaklaşık <strong>3.67</strong> katıdır. 
                  Yani Dünya sıradan bir Karpuz olsaydı, Ay bir <strong>Portakal</strong> büyüklüğünde olurdu!
                </p>
                <p className="mt-6 text-sm text-white/50 uppercase tracking-widest animate-pulse">
                  Astroidlere geçiliyor...
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : mode === "info2" ? (
          <motion.div 
            key="info2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col items-center justify-center p-6 space-y-12"
          >
            <div className="text-center max-w-4xl mt-12">
              <h2 className="text-3xl md:text-5xl font-light mb-4">Peki ya dev asteroitler <strong>4 Vesta</strong> ve <strong>16 Psyche</strong>?</h2>
              <p className="text-lg md:text-xl text-white/60 mb-12">Gelin onları Ay ile devasa bir ölçekte kıyaslayalım.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                {/* Moon */}
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center border border-white/10 bg-white/5 rounded-2xl p-6 relative overflow-hidden">
                  <div className="w-48 h-64 overflow-hidden rounded-xl mb-6 shadow-[-10px_-10px_30px_rgba(255,255,255,0.1)]">
                    <img src={SKYSCRAPER_IMG} className="w-full h-full object-cover" alt="Skyscraper" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Ay</h3>
                  <p className="text-white/50 text-sm">~3,474 km</p>
                  <p className="text-blue-400 font-medium mt-4 bg-blue-400/10 px-4 py-2 rounded-full text-sm uppercase tracking-wide">Eğer Dev Bir Gökdelen Olsaydı</p>
                  <div className="absolute -top-12 -right-12 w-32 h-32 opacity-10"><img src={MOON_IMG} className="w-full h-full object-cover rounded-full" /></div>
                </motion.div>
                
                {/* Vesta */}
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col items-center border border-white/10 bg-white/5 rounded-2xl p-6 relative overflow-hidden">
                  <div className="w-48 h-32 overflow-hidden rounded-xl mb-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <img src={APARTMENT_IMG} className="w-full h-full object-cover" alt="Apartment" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-yellow-300">4 Vesta</h3>
                  <p className="text-white/50 text-sm">~525 km (Güneş Sistemindeki En Büyük 2. Asteroit)</p>
                  <p className="text-yellow-400 font-medium mt-4 bg-yellow-400/10 px-4 py-2 rounded-full text-sm uppercase tracking-wide">5 Katlı Bir Apartman Olurdu</p>
                  <div className="absolute -top-12 -right-12 w-32 h-32 opacity-10"><img src={VESTA_IMG} className="w-full h-full object-cover rounded-full" /></div>
                </motion.div>

                {/* Psyche */}
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }} className="flex flex-col items-center border border-white/10 bg-white/5 rounded-2xl p-6 relative overflow-hidden">
                  <div className="w-40 h-24 overflow-hidden rounded-xl mb-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <img src={HOUSE_IMG} className="w-full h-full object-cover" alt="House" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-purple-300">16 Psyche</h3>
                  <p className="text-white/50 text-sm">~220 km (Değerli Metal Dolu Asteroit)</p>
                  <p className="text-purple-400 font-medium mt-4 bg-purple-400/10 px-4 py-2 rounded-full text-sm uppercase tracking-wide">Müstakil Bir Ev Olurdu</p>
                  <div className="absolute -top-12 -right-12 w-32 h-32 opacity-10"><img src={PSYCHE_IMG} className="w-full h-full object-cover rounded-full" /></div>
                </motion.div>
              </div>

              <motion.button
                onClick={() => setMode("drag")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-12 px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold tracking-widest uppercase transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105"
              >
                Tamam, Serbest Kıyaslamaya Geç
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="drag"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex-1 flex flex-col h-full w-full relative"
          >
            {/* Top Toolbar */}
            <div className="absolute top-24 left-0 right-0 flex justify-center z-40 pointer-events-none">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-center text-white/80 tracking-wide font-light shadow-2xl flex items-center gap-3">
                <Info className="w-5 h-5" />
                <span>Gök cisimlerini tutarak aşağıdaki <strong>Evren Boşluğuna</strong> sürükleyin. Oransal gerçek ölçeklerini göreceksiniz.</span>
              </div>
            </div>

            {/* Planets Stand */}
            <div className="h-[40%] w-full flex items-end justify-center gap-8 sm:gap-16 border-b border-white/10 bg-gradient-to-b from-transparent to-white/5 relative z-30 pb-16">
              {/* Earth */}
              <motion.div
                drag
                dragSnapToOrigin={!isEarthInZone}
                onDragEnd={(_, info) => {
                  if (info.point.y > window.innerHeight * 0.4) {
                    setIsEarthInZone(true);
                  } else {
                    setIsEarthInZone(false);
                  }
                }}
                animate={{
                  scale: isEarthInZone ? 3.67 : 1,
                  y: isEarthInZone ? 0 : 0,
                  filter: isEarthInZone ? 'brightness(1)' : 'brightness(0.8)',
                  zIndex: isEarthInZone ? 10 : 20
                }}
                className="cursor-grab active:cursor-grabbing flex flex-col items-center"
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-blue-900/40">
                  <img src={EARTH_IMG} alt="Earth" className="w-full h-full object-cover pointer-events-none" />
                </div>
                {!isEarthInZone && <span className="mt-4 text-xs font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">Dünya</span>}
              </motion.div>

              {/* Moon */}
              <motion.div
                drag
                dragSnapToOrigin={!isMoonInZone}
                onDragEnd={(_, info) => {
                  if (info.point.y > window.innerHeight * 0.4) {
                    setIsMoonInZone(true);
                  } else {
                    setIsMoonInZone(false);
                  }
                }}
                animate={{
                  scale: 1, // Moon stays 1x base
                  filter: isMoonInZone ? 'brightness(1.2)' : 'brightness(0.7)',
                  zIndex: isMoonInZone ? 20 : 20
                }}
                className="cursor-grab active:cursor-grabbing flex flex-col items-center"
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] bg-gray-500/20">
                  <img src={MOON_IMG} alt="Moon" className="w-full h-full object-cover pointer-events-none grayscale brightness-125 mix-blend-screen" />
                </div>
                {!isMoonInZone && <span className="mt-4 text-xs font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">Ay</span>}
              </motion.div>

              {/* Vesta */}
              <motion.div
                drag
                dragSnapToOrigin={!isVestaInZone}
                onDragEnd={(_, info) => setIsVestaInZone(info.point.y > window.innerHeight * 0.45)}
                animate={{
                  scale: isVestaInZone ? 0.15 : 0.6, // 525km vs 3474km
                  filter: isVestaInZone ? 'brightness(1.1)' : 'brightness(0.8)',
                  zIndex: isVestaInZone ? 30 : 20
                }}
                className="cursor-grab active:cursor-grabbing flex flex-col items-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden drop-shadow-[0_0_15px_rgba(252,211,77,0.2)] bg-yellow-900/20">
                  <img src={VESTA_IMG} alt="Vesta" className="w-full h-full object-cover pointer-events-none mix-blend-screen" />
                </div>
                {!isVestaInZone && <span className="mt-4 text-xs font-bold text-yellow-500/60 uppercase tracking-widest whitespace-nowrap">4 Vesta</span>}
              </motion.div>

              {/* Psyche */}
              <motion.div
                drag
                dragSnapToOrigin={!isPsycheInZone}
                onDragEnd={(_, info) => setIsPsycheInZone(info.point.y > window.innerHeight * 0.45)}
                animate={{
                  scale: isPsycheInZone ? 0.06 : 0.4, // 220km vs 3474km
                  filter: isPsycheInZone ? 'brightness(1.1)' : 'brightness(0.8)',
                  zIndex: isPsycheInZone ? 40 : 20
                }}
                className="cursor-grab active:cursor-grabbing flex flex-col items-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden drop-shadow-[0_0_15px_rgba(192,132,252,0.2)] bg-purple-900/20">
                  <img src={PSYCHE_IMG} alt="Psyche" className="w-full h-full object-cover pointer-events-none mix-blend-screen" />
                </div>
                {!isPsycheInZone && <span className="mt-4 text-xs font-bold text-purple-400/60 uppercase tracking-widest whitespace-nowrap">16 Psyche</span>}
              </motion.div>
            </div>

            {/* Universe (Canvas) Area */}
            <div className="h-[60%] w-full relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black flex items-center justify-center p-8">
              {/* Universe Guidelines */}
              <div className="absolute inset-8 border-2 border-dashed border-white/10 rounded-3xl pointer-events-none flex items-center justify-center">
                {(!isEarthInZone && !isMoonInZone && !isVestaInZone && !isPsycheInZone) && (
                  <span className="text-white/20 uppercase tracking-[0.3em] font-light text-xl md:text-3xl text-center px-4 leading-relaxed">
                    Evren Boşluğu<br/><span className="text-sm tracking-widest">Gezegenleri buraya bırakın</span>
                  </span>
                )}
              </div>
              
              {/* Stars Background Effect */}
              <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0))', backgroundSize: '200px 200px' }} />
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
