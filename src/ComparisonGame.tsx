import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Maximize2, Layers } from "lucide-react";
import ComparisonGamePart1 from "./ComparisonGamePart1";
import ComparisonGamePart2 from "./ComparisonGamePart2";

interface ComparisonGameProps {
  onExit: () => void;
}

export default function ComparisonGame({ onExit }: ComparisonGameProps) {
  const [selectedMode, setSelectedMode] = useState<"menu" | "part1" | "part2">("menu");

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        {selectedMode === "menu" ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full w-full p-8"
          >
            {/* Geri Dön Butonu */}
            <div className="absolute top-0 left-0 right-0 z-50 p-6 md:p-8 flex items-center justify-between">
              <button 
                onClick={onExit}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
              >
                <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm uppercase tracking-widest hidden md:inline">Maceraya Dön</span>
              </button>
            </div>

            <h2 className="text-4xl md:text-6xl font-display font-medium mb-12 text-center max-w-2xl leading-tight">
              Nasıl Bir Kıyaslama Yapmak İstersin?
            </h2>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
              {/* Part 1 Button */}
              <motion.button
                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMode("part1")}
                className="flex-1 p-8 rounded-3xl border border-white/10 bg-white/5 flex flex-col items-center gap-6 group hover:bg-white/10 transition-colors relative overflow-hidden"
              >
                <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                  <Layers className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-light tracking-wide">2D Metaforlar</h3>
                <p className="text-white/50 text-center text-sm leading-relaxed px-4">
                  Karpuzlar ve basketbol topları eşliğinde Ay'ın boyutunu tahmin etme oyunu.
                </p>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              {/* Part 2 Button */}
              <motion.button
                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMode("part2")}
                className="flex-1 p-8 rounded-3xl border border-white/10 bg-white/5 flex flex-col items-center gap-6 group hover:bg-white/10 transition-colors relative overflow-hidden"
              >
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                  <Maximize2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-light tracking-wide">3D Serbest Deneme</h3>
                <p className="text-white/50 text-center text-sm leading-relaxed px-4">
                  Gerçekçi 3 Boyutlu ortamda Dünya ve Ay'ın boyutlarını kendin oranla ve yüzdelik oranını gör.
                </p>
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>
          </motion.div>
        ) : selectedMode === "part1" ? (
          <motion.div
            key="part1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full w-full"
          >
            <ComparisonGamePart1 onExit={() => setSelectedMode("menu")} />
          </motion.div>
        ) : (
          <motion.div
            key="part2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full w-full"
          >
            <ComparisonGamePart2 onExit={() => setSelectedMode("menu")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
