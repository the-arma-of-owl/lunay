import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ArrowDown, ArrowUp, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

import balkabagiImg from './meyveler/balkabagi.png';
import karpuzImg from './meyveler/karpuz2.png';
import portakalImg from './meyveler/portakal2.png';
import yumurtaImg from './meyveler/yumurta.png';

import basketImg from './toplar/basket-ball-out-door-game-png.png';
import futbolImg from './toplar/futboltopu.png';
import pilatesImg from './toplar/pilates_topu.png';
import tenisImg from './toplar/tenis.png';

interface ComparisonGamePart1Props {
  onExit: () => void;
}

// Birden fazla soru barındıran veri yapısı
const QUESTIONS = [
  {
    title: "Eğer Dünya bir Karpuz olsa, Ay hangi büyüklükte olurdu?",
    image: karpuzImg,
    correctSize: 10,
    options: [
      { id: 1, label: "Balkabağı", size: 40, image: balkabagiImg },
      { id: 2, label: "Portakal", size: 10, image: portakalImg },
      { id: 3, label: "Yumurta", size: 5, image: yumurtaImg },
    ]
  },
  {
    title: "Eğer Dünya bir Basketbol Topu olsa, Ay hangi büyüklükte olurdu?",
    image: basketImg,
    correctSize: 2,
    options: [
      { id: 1, label: "Pilates Topu", size: 20, image: pilatesImg },
      { id: 2, label: "Futbol Topu", size: 8, image: futbolImg },
      { id: 3, label: "Tenis Topu", size: 2, image: tenisImg },
    ]
  }
];

export default function ComparisonGamePart1({ onExit }: ComparisonGamePart1Props) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"lower" | "higher" | "correct" | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  const QUESTION = QUESTIONS[currentQuestionIdx];

  const handleNextQuestion = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedId(null);
      setAttempts(0);
      setIsCorrect(false);
      setFeedbackType(null);
    } else {
      setGameCompleted(true);
    }
  };

  const handleOptionClick = (optionId: number, optionSize: number) => {
    if (isCorrect) return; // Zaten doğru bilindiyse tıklamayı engelle

    setSelectedId(optionId);
    if (attempts === 0) {
      setAttempts(1);
    } else {
      setAttempts(prev => prev + 1);
    }

    if (optionSize === QUESTION.correctSize) {
      setIsCorrect(true);
      setFeedbackType("correct");
      
      // Tekte doğru bilindiyse özel konfeti efekti
      if (attempts === 0) {
        triggerConfetti(2); // Kısa konfeti
      } else {
        triggerConfetti(1); // Biraz daha kısa
      }
    } else if (optionSize > QUESTION.correctSize) {
      // Seçilen değer asıl değerden büyükse -> daha düşük (yeşil ok)
      setFeedbackType("lower");
    } else {
      // Seçilen değer asıl değerden küçükse -> daha büyük (kırmızı ok)
      setFeedbackType("higher");
    }
  };

  const triggerConfetti = (seconds: number = 3) => {
    const duration = seconds * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#22c55e', '#ffffff', '#eab308']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#22c55e', '#ffffff', '#eab308']
      });
    }, 250);
  };

  if (gameCompleted) {
    return (
      <div className="relative h-full w-full flex flex-col items-center justify-center bg-black text-white p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center gap-8"
        >
          <div className="w-32 h-32 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-400" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display text-green-400">Tebrikler!</h2>
          <p className="text-xl md:text-2xl text-white/70 max-w-lg">
            Tüm boyut kıyaslamalarını başarıyla tamamladın. Ay'ın boyutunu artık çok daha iyi algılayabilirsin!
          </p>
          <button 
            onClick={onExit}
            className="mt-8 px-10 py-4 border border-white/20 rounded-full font-light tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
          >
            Menüye Dön
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full flex flex-col bg-black text-white p-4 md:p-8 overflow-y-auto">
      {/* Geri Dön Butonu */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 md:p-8 flex items-center justify-between">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm uppercase tracking-widest hidden md:inline">Geri Dön</span>
        </button>
        <div className="text-white/40 text-sm tracking-widest">
          {currentQuestionIdx + 1} / {QUESTIONS.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full gap-6 md:gap-8 mt-16 md:mt-8 pb-16">
        
        {/* Soru Başlığı */}
        <motion.h2 
          key={`title-${currentQuestionIdx}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-display font-medium text-center px-4"
        >
          {QUESTION.title}
        </motion.h2>

        {/* Görsel Alanı */}
        <motion.div 
          key={`img-${currentQuestionIdx}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/10"
        >
          <img 
            src={QUESTION.image} 
            alt="Question Base" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Seçenekler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full mt-2">
          <AnimatePresence mode="popLayout">
            {QUESTION.options.map((option, index) => {
              const isSelected = selectedId === option.id;
              
              return (
                <motion.button
                  key={`${currentQuestionIdx}-${option.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={!isCorrect ? { scale: 1.05, borderColor: "rgba(255,255,255,0.4)" } : {}}
                  whileTap={!isCorrect ? { scale: 0.95 } : {}}
                  onClick={() => handleOptionClick(option.id, option.size)}
                  className={`relative px-4 py-6 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 backdrop-blur-sm
                    ${isSelected && feedbackType === 'correct' ? 'bg-green-500/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : ''}
                    ${isSelected && feedbackType === 'lower' ? 'bg-white/5 border-green-500/50' : ''}
                    ${isSelected && feedbackType === 'higher' ? 'bg-white/5 border-red-500/50' : ''}
                    ${!isSelected ? 'bg-white/5 border-white/10 hover:bg-white/10' : ''}
                    ${isCorrect && !isSelected ? 'opacity-30 cursor-not-allowed' : ''}
                  `}
                >
                  {/* Seçeneğin Görseli */}
                  {option.image && (
                    <img 
                      src={option.image} 
                      alt={option.label} 
                      className="w-20 h-20 md:w-28 md:h-28 object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    />
                  )}
                  <span className="text-lg md:text-xl font-light tracking-wide mt-2">{option.label}</span>
                  
                  {/* Feedback İkonları */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, y: feedbackType === 'lower' ? -20 : 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute -bottom-6 z-10"
                    >
                      {feedbackType === 'correct' && (
                        <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                      )}
                      
                      {feedbackType === 'lower' && (
                        <div className="flex flex-col items-center gap-1 text-green-400">
                          <span className="text-sm font-bold bg-green-500/20 px-3 py-1 rounded-full backdrop-blur-md">Daha Düşük</span>
                          <ArrowDown className="w-8 h-8 animate-bounce bg-black/50 rounded-full" />
                        </div>
                      )}

                      {feedbackType === 'higher' && (
                        <div className="flex flex-col items-center gap-1 text-red-500">
                          <ArrowUp className="w-8 h-8 animate-bounce bg-black/50 rounded-full" />
                          <span className="text-sm font-bold bg-red-500/20 px-3 py-1 rounded-full backdrop-blur-md">Daha Büyük</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Sonuç Mesajı */}
        <div className="h-24 md:h-32 mt-4 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {isCorrect && (
              <motion.div
                key={`result-${currentQuestionIdx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center text-center"
              >
                <h3 className="text-xl md:text-2xl text-green-400 font-medium mb-1">Tebrikler! Doğru bildin.</h3>
                {attempts === 1 ? (
                  <p className="text-white/70 text-sm md:text-base">Harika! Tek denemede buldun.</p>
                ) : (
                  <p className="text-white/70 text-sm md:text-base">Toplam {attempts} denemede buldun.</p>
                )}
                
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={handleNextQuestion}
                  className="mt-4 px-6 md:px-8 py-2 md:py-3 bg-white text-black rounded-full font-medium tracking-wide hover:scale-105 transition-transform"
                >
                  {currentQuestionIdx < QUESTIONS.length - 1 ? "Sıradaki Soru" : "Oyunu Tamamla"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}
