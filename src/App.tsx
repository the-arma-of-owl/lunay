/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft } from "lucide-react";
import LunarLander from "./LunarLander";
import ComparisonGame from "./ComparisonGame";
import EarthMoonSimulation from "./components/EarthMoonSimulation";
import HistoricalMaps from "./HistoricalMaps";
import Article1 from "./components/articles/Article1";
import Article2 from "./components/articles/Article2";
import Article3 from "./components/articles/Article3";
import Article5 from "./components/articles/Article5";
import EternityJourney from "./EternityJourney";

const CATEGORIES = [
  {
    id: 1,
    title: "Geçmişin İzinde",
    description: "Ay'ın haritalanma serüveni ve tarihteki ilk gözlemler.",
    image: "/cat_history.png",
  },
  {
    id: 2,
    title: "Kültür ve Gizem",
    description: "İnançlar, efsaneler ve Ay'ın karanlık yüzündeki sırlar.",
    image: "/cat_mystery.png",
  },
  {
    id: 3,
    title: "Keşif ve Gelecek",
    description: "Modern uzay görevleri ve insanlığın Ay'daki geleceği.",
    image: "/cat_future.png",
  },
  {
    id: 4,
    title: "Oyunlar ve Simülasyon",
    description: "Dünya-Ay simülasyonu ve interaktif keşif oyunları.",
    image: "/sec_simulasyon.png",
  },
  {
    id: 5,
    title: "Sonsuzluğa Mesaj",
    description: "Kelimelerinizi bir elektromanyetik sinyale dönüştürüp uzaya gönderin.",
    image: "/bg3.png",
  },
];

const SECTIONS = [
  {
    id: 1,
    categoryId: 1,
    title: "Geçmişten Günümüze Haritalar",
    description: "Ay'ın detaylı haritalanma serüveni ve tarihi astronomlar.",
    image: "/sec_harita.png",
  },
  {
    id: 2,
    categoryId: 1,
    title: "Geçmişten Günümüze Ay",
    description: "İnsanlığın ilk gözlemlerinden teleskopik keşiflere uzanan yolculuk.",
    image: "/sec_gecmis_ay.png",
  },
  {
    id: 3,
    categoryId: 2,
    title: "Ay ve İnanç",
    description: "Mitolojilerde, dinlerde ve kadim kültürlerde ayın kutsal yeri.",
    image: "/sec_inanc.png",
  },
  {
    id: 4,
    categoryId: 3,
    title: "Günümüzde Ay",
    description: "Modern bilim, Apollo görevleri ve yüksek çözünürlüklü keşifler.",
    image: "/sec_gunumuz_ay.png",
  },
  {
    id: 5,
    categoryId: 2,
    title: "Ay'ın Gizemleri",
    description: "Karanlık yüzü, kraterleri ve henüz çözülememiş sırlar.",
    image: "/sec_gizemler.png",
  },
  {
    id: 6,
    categoryId: 3,
    title: "Gelecekte Ay",
    description: "Artemis programı, ay üsleri ve yeni bir yaşamın kapıları.",
    image: "/sec_gelecek.png",
  },
  {
    id: 7,
    categoryId: 4,
    title: "Kıyaslama Oyunu",
    description: "Dünya ve Ay'ın gerçek boyutlarını interaktif bir şekilde keşfet.",
    image: "/sec_kiyas.png",
  },
  {
    id: 8,
    categoryId: 4,
    title: "Dünya-Ay Simülasyonu",
    description: "Tutulma, gelgit kilitlenmesi ve Ay'ın gizemlerini keşfet.",
    image: "/sec_simulasyon.png",
  },
  {
    id: 9,
    categoryId: 4,
    title: "Görev: Ay'a İniş",
    description: "Ay modülünü güvenli bir şekilde yüzeye indirin.",
    image: "/sec_oyun.png",
  },
  {
    id: 10,
    categoryId: 5,
    title: "Mesajınızı Gönderin",
    description: "Derin uzay terminalini kullanarak Ay'a ve ötesine mesaj yollayın.",
    image: "/ay_girdabi.jpg",
  },
];

type ViewType = "landing" | "adventure" | "game" | "comparison" | "simulation" | "maps" | "article1" | "article2" | "article3" | "article5" | "eternity";

export default function App() {
  const [view, setView] = useState<ViewType>("landing");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const activeItems = activeCategoryId === null 
    ? CATEGORIES 
    : SECTIONS.filter(section => section.categoryId === activeCategoryId);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="h-full w-full"
          >
            {/* Background Video */}
            <div className="absolute inset-0 h-full w-full overflow-hidden">
              <iframe
                src="https://streamable.com/e/olhcxz?autoplay=1&muted=1&loop=1&controls=0"
                frameBorder="0"
                width="100%"
                height="100%"
                allowFullScreen
                allow="autoplay"
                className="absolute inset-0 h-full w-full scale-[1.8] translate-y-[45%] object-cover opacity-85 pointer-events-none"
                style={{ border: 'none' }}
              />
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-between py-12 px-6">
              {/* Top Header: Logo Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-center"
              >
                <img 
                  src="https://i.ibb.co/nsm920N9/backgraound.png" 
                  alt="LunAy Logo" 
                  className="h-56 md:h-96 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Center Button: Keşfet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="flex flex-col items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 255, 255, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: ["0 0 10px rgba(255,255,255,0.1)", "0 0 20px rgba(255,255,255,0.2)", "0 0 10px rgba(255,255,255,0.1)"] 
                  }}
                  transition={{ 
                    boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="px-10 py-4 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-lg md:text-xl font-light tracking-[0.2em] uppercase transition-colors hover:bg-white/20"
                  onClick={() => setView("adventure")}
                >
                  KEŞFET
                </motion.button>
              </motion.div>

              {/* Bottom Text: Descriptive Slogan */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1.2, duration: 1.5 }}
                className="text-center max-w-md pb-8"
              >
                <p className="text-sm md:text-base font-light tracking-[0.4em] uppercase text-white/70 leading-relaxed">
                  Yenilikçi Ay Keşif ve Anlatım Deneyimi
                </p>
              </motion.div>

              {/* Bottom Detail (Optional) */}
            </div>

            {/* Vignette Effect */}
            <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_center,_transparent_0%,_black_90%]" />
          </motion.div>
        ) : view === "adventure" ? (
          <motion.div
            key="adventure"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full flex flex-col"
          >
            {/* Header with Back Button */}
            <div className="absolute top-0 left-0 right-0 z-50 p-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
              <button 
                onClick={() => {
                  if (activeCategoryId !== null) {
                    setActiveCategoryId(null);
                  } else {
                    setView("landing");
                  }
                }}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
              >
                <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm uppercase tracking-widest">{activeCategoryId !== null ? 'Kategoriler' : 'Ana Menü'}</span>
              </button>
              <img 
                src="https://i.ibb.co/nsm920N9/backgraound.png" 
                alt="LunAy Logo" 
                className="h-20 md:h-24 object-contain opacity-90 drop-shadow-md origin-right"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Vertical Slideshow */}
            <div className="flex-1 flex h-full">
              {activeItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  onClick={() => {
                    if (activeCategoryId === null) {
                      setActiveCategoryId(item.id);
                    } else {
                      const sectionId = item.id;
                      if (sectionId === 1) setView("maps");
                      if (sectionId === 2) setView("article1");
                      if (sectionId === 3) setView("article2");
                      if (sectionId === 4) setView("article3");
                      if (sectionId === 5) setView("simulation");
                      if (sectionId === 6) setView("article5");
                      if (sectionId === 7) setView("comparison");
                      if (sectionId === 8) setView("simulation");
                      if (sectionId === 9) setView("game");
                      if (sectionId === 10) setView("eternity");
                    }
                  }}
                  className="relative flex-1 group overflow-hidden border-r border-white/5 last:border-r-0 cursor-pointer transition-all duration-700 hover:flex-[1.5]"
                >
                  {/* Background Image (at bottom) */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="h-full w-full object-cover opacity-30 grayscale transition-all duration-700 group-hover:opacity-60 group-hover:grayscale-0 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-center">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 1 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight leading-tight group-hover:text-white transition-colors">
                        {item.title}
                      </h2>
                      <div className="w-12 h-[1px] bg-white/20 group-hover:w-24 group-hover:bg-white/60 transition-all duration-500" />
                      <p className="text-sm text-white/40 opacity-0 group-hover:opacity-100 transition-all duration-500 max-w-[200px] leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Vertical Number */}
                  <div className="absolute top-1/2 -right-4 -translate-y-1/2 rotate-90 text-8xl font-display font-black text-white/5 pointer-events-none group-hover:text-white/10 transition-colors">
                    0{index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : view === "maps" ? (
          <motion.div
            key="maps"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full"
          >
            <HistoricalMaps onExit={() => setView("adventure")} />
          </motion.div>
        ) : view === "comparison" ? (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full"
          >
            <ComparisonGame onExit={() => setView("adventure")} />
          </motion.div>
        ) : view === "simulation" ? (
          <motion.div
            key="simulation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full"
          >
            <EarthMoonSimulation onExit={() => setView("adventure")} />
          </motion.div>
        ) : view === "article1" ? (
          <motion.div
            key="article1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full"
          >
            <Article1 onBack={() => setView("adventure")} />
          </motion.div>
        ) : view === "article2" ? (
          <motion.div
            key="article2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full"
          >
            <Article2 onBack={() => setView("adventure")} />
          </motion.div>
        ) : view === "article3" ? (
          <motion.div
            key="article3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full"
          >
            <Article3 onBack={() => setView("adventure")} />
          </motion.div>
        ) : view === "article5" ? (
          <motion.div
            key="article5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full"
          >
            <Article5 onBack={() => setView("adventure")} />
          </motion.div>
        ) : view === "eternity" ? (
          <motion.div
            key="eternity"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full"
          >
            <EternityJourney onExit={() => setView("adventure")} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full"
          >
            <LunarLander onExit={() => setView("adventure")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
