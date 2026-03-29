import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";

import enEskisiImg from "./ha/en eskisi.jpeg";
import galileoImg from "./ha/gaalileo.jpeg";
import heveliusImg from "./ha/hevelius.jpeg";
import heveliusColorImg from "./ha/efecam7.png";
import riccioliImg from "./ha/givonatti balista.jpeg";
import beerImg from "./ha/wilheim beer johann heinrick.jpeg";
import schmidtImg from "./ha/Julius schmit.jpeg";
import lroImg from "./ha/even adair.jpeg";

interface HistoricalMapsProps {
  onExit: () => void;
}

const TIMELINE_DATA = [
  {
    year: "MÖ ~3000",
    title: "Knowth Taş Oyması",
    image: enEskisiImg,
    description: "İrlanda'nın Knowth bölgesinde bulunan bu megalitik taş oyması, insanlığın bilinen en eski Ay tasviri olarak kabul edilmektedir. Yaklaşık 5.000 yıl öncesine tarihlenen bu oyma, Ay'ın evrelerini ve yüzey detaylarını taşa işlemiştir. Neolitik dönem insanlarının gökyüzünü ne denli dikkatli gözlemlediğini ve bu bilgiyi kalıcı bir şekilde kaydetme isteğini gösteren bu eser, Ay haritalama tarihinin başlangıç noktası sayılmaktadır."
  },
  {
    year: "1610",
    title: "Galileo Galilei",
    image: galileoImg,
    description: "1564'te İtalya'da doğmuş bir astronom, fizikçi ve matematikçidir; 1609'da teleskopu astronomik gözlem için kullanan ilk bilim insanlarından biri olarak, Ay, Jüpiter'in uyduları ve Venüs'ün evrelerini incelemiştir; Ay gözlemlerinde, daha önce düz kabul edilen yüzeyin kraterler ve dağlarla dolu olduğunu göstererek, gök cisimlerinin mükemmel ve sabit olmadığı fikrini kanıtlamıştır; Galileo, bilimsel yöntemi deney ve gözlemle destekleyerek, Copernicus'un Güneş merkezli sistemini savunmuş ve modern astronomi için temel bir geçiş dönemi figürü olmuştur."
  },
  {
    year: "1647",
    title: "Johannes Hevelius",
    image: heveliusImg,
    description: "1611'de Polonya'da doğmuş bir astronom ve belediye yöneticisidir; 1647'de yayımladığı Selenographia ile Ay'ın detaylı haritasını hazırlamış, kraterler, dağlar ve düzlükleri sistemli şekilde çizmiş ve isimlendirmede büyük katkı sağlamıştır; Hevelius, teleskop ve hassas ölçüm aletleri kullanarak yaptığı gözlemlerle Ay haritalamasını bilimsel bir temele oturtmuş ve modern selenografinin kurucularından biri olarak kabul edilmiştir."
  },
  {
    year: "1647",
    title: "Hevelius – Selenographia Haritası",
    image: heveliusColorImg,
    description: "Johannes Hevelius'un 1647'de yayımladığı Selenographia eserinden alınan bu renklendirilmiş Ay haritası, dönemin en kapsamlı ve sanatsal selenografik çalışmasıdır. Harita, Ay'ın görünen yüzeyindeki denizleri (mare), kraterleri ve dağ sıralarını detaylı bir şekilde betimlemektedir. Barok dönemin süsleme anlayışını yansıtan melek figürleri ve şeritlerle çevrili bu eser, bilimsel doğruluk ile sanatsal estetiği bir arada sunan nadir haritalardan biridir."
  },
  {
    year: "1651",
    title: "Giovanni Battista Riccioli",
    image: riccioliImg,
    description: "1598'de İtalya'da doğmuş bir astronom ve Cizvit Tarikatı üyesidir; en önemli eseri Almagestum Novum'u yazmasının amacı, Nicolaus Copernicus ve Galileo Galilei tarafından savunulan Güneş merkezli evren modelini değerlendirmekti; teleskopun yaşamı sırasında ortaya çıkmasıyla, özellikle Francesco Maria Grimaldi ile yaptığı gözlemler sayesinde Ay yüzeyini inceleyip kraterleri adlandırmış ve bugün hâlâ kullanılan isimlendirme sistemini oluşturmuştur; Riccioli yeni fikirleri deneyle test eden, ancak kanıtları yeterli olmadığında Dünya'nın sabit olabileceği görüşünü tamamen terk etmeyen, bilimsel geçiş döneminin önemli temsilcisidir."
  },
  {
    year: "1834",
    title: "Wilhelm Beer & Johann Heinrich Mädler",
    image: beerImg,
    description: "Wilhelm Beer 1797'de Almanya'da doğmuş bir astronom ve bankerdir; Johann Heinrich Mädler ile 1834–1836'da yayımladıkları Mappa Selenographica ile Ay'ın en ayrıntılı haritasını oluşturmuşlardır; teleskop ve hassas ölçüm aletleriyle sistematik gözlemler yapıp kraterleri, dağları ve düzlükleri doğru şekilde çizmişlerdir; Ay'ın morfolojisini ölçüp boyutlarını hesaplamış, modern selenografi için standart bir yöntem geliştirmişlerdir; bilimsel yaklaşımları gözlem verilerini kaydetme ve doğrulamaya dayanmış, böylece Riccioli ve Hevelius'un çizimlerine kıyasla çok daha doğru haritalar ortaya koymuş ve klasik dönemi kapatıp modern dönemi başlatmışlardır."
  },
  {
    year: "1878",
    title: "Julius Schmidt",
    image: schmidtImg,
    description: "1825'te Almanya'da doğmuş bir astronomdur; 1870'lerin sonlarında yaptığı gözlemlerle Ay'ın detaylı haritasını oluşturmuş ve bu haritaları 1878'de yayımlamıştır; teleskop ve hassas ölçüm aletleri kullanarak kraterleri, dağları ve düzlükleri sistemli şekilde çizmiş, özellikle önceki Beer–Mädler haritalarını daha yüksek doğruluk ve detayla geliştirmiştir; Schmidt'in çalışmaları, modern selenografinin temellerini güçlendirmiş, Ay yüzeyinin morfolojisini ölçme ve belgelenme standartlarını yükseltmiş ve 19. yüzyıl astronomisinin en kapsamlı Ay haritalarından biri olarak kabul edilmiştir."
  },
  {
    year: "2009–Günümüz",
    title: "NASA LRO – Topografik Harita",
    image: lroImg,
    description: "NASA'nın 2009 yılında fırlattığı Lunar Reconnaissance Orbiter (LRO) uzay aracı, Ay yüzeyinin şimdiye kadarki en ayrıntılı ve yüksek çözünürlüklü topografik haritasını oluşturmuştur. Lazer altimetre (LOLA) ve kameralar kullanarak Ay'ın tüm yüzeyini santimetre hassasiyetinde taramıştır. Bu renkli yükseklik haritasında mavi tonlar alçak bölgeleri (derin kraterler), kırmızı ve yeşil tonlar ise yüksek bölgeleri temsil etmektedir. LRO verileri, gelecekteki insanlı Ay görevleri için iniş noktası seçiminde kritik rol oynamakta ve Ay'ın jeolojik tarihini anlamamıza büyük katkı sağlamaktadır."
  }
];

export default function HistoricalMaps({ onExit }: HistoricalMapsProps) {
  return (
    <div className="relative w-full h-full bg-[#0a0a0a] text-white flex flex-col overflow-hidden font-sans">
      
      {/* Üst Kısım Menüsü */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 md:p-8 flex items-center justify-between pointer-events-none">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group pointer-events-auto bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"
        >
          <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm uppercase tracking-widest hidden md:inline">Maceraya Dön</span>
        </button>
        <div className="text-white/80 font-display text-xl tracking-widest bg-black/50 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md pointer-events-auto">
          Geçmişten Günümüze Haritalar
        </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto px-6 py-32 md:py-40 custom-scrollbar">
        <div className="max-w-5xl mx-auto flex flex-col gap-24 md:gap-32 relative">
          
          {/* Arkaplan Şeridi (Zaman Çizgisi) */}
          <div className="absolute left-8 md:left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-blue-500/30 to-transparent -translate-x-1/2 rounded-full hidden md:block" />

          {TIMELINE_DATA.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                
                {/* Resim Alanı */}
                <div className="w-full md:w-1/2 flex justify-center perspective-1000">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateY: isEven ? 5 : -5, boxShadow: "0 0 40px rgba(59,130,246,0.3)" }}
                    className="relative w-full max-w-sm aspect-square md:aspect-auto md:h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-2xl transition-all duration-500 will-change-transform"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover md:object-contain object-center opacity-90 transition-opacity hover:opacity-100"
                    />
                    {/* Yıl Etiketi (Mobil için) */}
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur border border-white/20 text-white font-display text-2xl font-bold px-4 py-2 rounded-xl md:hidden">
                      {item.year}
                    </div>
                  </motion.div>
                </div>

                {/* İçerik / Metin Alanı */}
                <div className={`w-full md:w-1/2 flex flex-col justify-center ${isEven ? 'md:items-start md:text-left' : 'md:items-end md:text-right'} items-center text-center relative`}>
                  
                  {/* Yıl Noktası (Masaüstü) */}
                  <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 ${isEven ? '-left-[4.5rem]' : '-right-[4.5rem]'} w-6 h-6 rounded-full bg-blue-500 border-4 border-black items-center justify-center z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]`}>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>

                  <span className="text-blue-400 font-display text-4xl md:text-6xl font-black tracking-tight mb-2 drop-shadow-lg opacity-80 hidden md:block">
                    {item.year}
                  </span>
                  
                  <h3 className="text-3xl md:text-4xl font-light text-white mb-6 uppercase tracking-wider">
                    {item.title}
                  </h3>
                  
                  <p className="text-white/60 text-base md:text-lg font-light leading-relaxed max-w-lg bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm shadow-inner text-justify md:text-left">
                    {item.description}
                  </p>
                </div>

              </motion.div>
            )
          })}
        </div>
      </div>

    </div>
  );
}
