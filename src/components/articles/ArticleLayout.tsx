import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

interface ArticleLayoutProps {
  children: ReactNode;
  onBack: () => void;
  className?: string;
  bgImageUrl?: string;
}

export default function ArticleLayout({ 
  children, 
  onBack, 
  className = "",
  bgImageUrl
}: ArticleLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`absolute inset-0 z-40 overscroll-none bg-black text-white font-sans ${className}`}
    >
      {bgImageUrl && (
        <div 
          className="fixed inset-0 z-0 opacity-60 pointer-events-none"
          style={{ backgroundImage: `url(${bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>
      )}
      <div className="h-full w-full overflow-y-auto relative z-10">
        {/* Navbar */}
        <div className="sticky top-0 left-0 right-0 z-50 p-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl">
          <button 
            onClick={onBack}
            className="flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity group"
          >
            <span className="text-xs tracking-[0.2em] font-light mb-1 uppercase text-gray-400">Geri</span>
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <img src="/logo.png" alt="LunAy" className="h-12 md:h-16 object-contain opacity-90" />
        </div>
        
        {/* Content Box */}
        <div className="mx-auto w-full pb-32">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
