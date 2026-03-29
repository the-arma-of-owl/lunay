import { useState } from "react";
import { motion } from "motion/react";
import { Play, Lock, Check } from "lucide-react";

interface QuizLockProps {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  children: React.ReactNode;
}

export default function QuizLock({ question, options, correctAnswerIndex, children }: QuizLockProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  const handleOptionClick = (index: number) => {
    if (unlocked) return;
    
    if (index === correctAnswerIndex) {
      setUnlocked(true);
      setSelectedStatus(index);
    } else {
      setSelectedStatus(index);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => { 
        if (!unlocked) setSelectedStatus(null); 
      }, 1500);
    }
  };

  return (
    <div className="relative w-full my-20">
      {/* Kilit Bilgi ve Soru Kutusu - Ultra Minimal */}
      <div className="p-8 md:p-12 border border-white/10 relative z-20 mx-auto max-w-3xl text-center bg-black/60 backdrop-blur-lg rounded-sm">
        <div className="mb-6 flex justify-center">
          {!unlocked ? (
            <Lock className="w-6 h-6 text-white/40" />
          ) : (
            <Check className="w-6 h-6 text-white" />
          )}
        </div>
        <h3 className="text-xl md:text-2xl font-light mb-10 text-white/90 leading-relaxed tracking-wide">{question}</h3>
        
        <motion.div 
          animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {options.map((opt, idx) => {
            const isCorrect = unlocked && idx === correctAnswerIndex;
            const isWrongSelected = !unlocked && selectedStatus === idx;
            const isNeutral = !unlocked && selectedStatus !== idx;

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                className={`py-4 px-6 border transition-all font-light tracking-wide text-sm md:text-base rounded-sm
                  ${isCorrect ? 'bg-white text-black border-white' : ''}
                  ${isWrongSelected ? 'bg-transparent border-white/30 text-white/50 opacity-50' : ''}
                  ${isNeutral ? 'border-white/10 text-white/70 hover:border-white/40 hover:bg-white/5' : ''}
                `}
                disabled={unlocked}
              >
                {opt}
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Şartlı Görünen veya Bulanık Görünen Kısım */}
      <div className="relative mt-8 transition-all duration-1000 ease-in-out">
        {unlocked && (
          <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent mx-auto mt-8 mb-12" />
        )}

        {!unlocked && (
          <div className="absolute inset-x-0 bottom-0 top-12 z-10 flex flex-col items-center justify-start pt-24 bg-gradient-to-b from-transparent to-black">
            <div className="flex flex-col items-center gap-4 mt-8 opacity-60">
              <Play className="w-4 h-4 text-white" />
              <p className="text-white/50 tracking-[0.2em] uppercase text-xs font-light">
                İlerlemek için yanıtlayın
              </p>
            </div>
          </div>
        )}
        <div className={`transition-all duration-[1500ms] ${unlocked ? 'filter-none opacity-100 pointer-events-auto' : 'blur-xl opacity-10 pointer-events-none select-none overflow-hidden max-h-[400px]'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
