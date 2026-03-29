import { Rocket, Target, Zap, Cpu, Map, Eye, DollarSign, FlaskConical, Gavel, ArrowRight, BookOpen } from "lucide-react";
import ArticleLayout from "./ArticleLayout";
import QuizLock from "./QuizLock";

export default function Article5({ onBack }: { onBack: () => void }) {
  return (
    <ArticleLayout onBack={onBack} bgImageUrl="/bg5.png">
      <div className="w-full max-w-4xl mx-auto px-6 py-24 text-white/80 font-light">
        
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">Bölüm IV</span>
          <h1 className="text-3xl md:text-5xl font-light tracking-wide text-white">
            Gelecekte Ay
          </h1>
          <div className="w-px h-16 bg-white/20 mx-auto mt-12" />
        </div>

        <div className="mb-20">
          <p className="text-lg leading-[1.8] text-white/70 text-justify mb-10 border border-white/10 p-8">
            Ay ile ilgili gelecekteki çalışmalar, hem bilimsel keşif hem de insanlığın uzaydaki kalıcı varlığı açısından stratejik bir alanı kapsar. Bu çalışmalar keşif, teknoloji geliştirme, kaynak kullanımı ve uzun vadeli yerleşim etrafında şekillenmektedir.
          </p>

          <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">Tesisleşme</span>
          <h2 className="text-2xl font-light mb-8 text-white tracking-wide">Üsler ve Lunar Gateway</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="border border-white/10 p-8">
              <Target className="w-6 h-6 text-white/40 mb-6" />
              <h3 className="text-base uppercase tracking-widest font-light mb-4 text-white">Kalıcı Üsler</h3>
              <p className="text-white/50 leading-relaxed text-sm text-justify">
                NASA Artemis Programı ile astronotların güney kutbunda kalıcı üsler kurması planlanmaktadır. Bu üsler, uzun süreli insan yaşamının test edileceği ilk merkezler olacaktır.
              </p>
            </div>
            <div className="border border-white/10 p-8">
              <Rocket className="w-6 h-6 text-white/40 mb-6" />
              <h3 className="text-base uppercase tracking-widest font-light mb-4 text-white">Yörünge İstasyonu</h3>
              <p className="text-white/50 leading-relaxed text-sm text-justify">
                Lunar Gateway, Ay yörüngesinde bir istasyon kurarak hem bilimsel deneyler hem de yüzeye inişler için lojistik destek sağlayacaktır.
              </p>
            </div>
          </div>

          <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">Ekonomi ve Enerji</span>
          <h2 className="text-2xl font-light mb-8 text-white tracking-wide">Ay Kaynaklarının Kullanımı (ISRU)</h2>
          <div className="space-y-6 text-white/70 leading-[1.8] text-justify mb-8 pl-6 border-l border-white/10">
            <p>
              Ay yüzeyinde bulunan su buzu, helyum-3 ve diğer minerallerin çıkarılması hedeflenmektedir. Özellikle <strong>suyun oksijen ve hidrojene ayrılarak yakıt üretiminde kullanılması</strong>, Dünya'dan kalkan görevlerin bütçesini büyük ölçüde hafifletecektir. Güneş enerjisi ve helyum-3 kullanılarak nükleer füzyon enerjisi üretimi değerlendirilmektedir.
            </p>
          </div>
        </div>

        <QuizLock
          question="Uzay görevlerinin maliyetini azaltacak olan ISRU (yerinde kaynak kullanımı) projesinde Ay'dan yakıt üretmek için hedeflenen kaynak hangisidir?"
          options={["Radyoaktif Plütonyum", "Su Buzu", "Ay Tozu", "Helyum-10"]}
          correctAnswerIndex={1}
        >
          <div className="mb-20">
            <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">Araştırma Disiplinleri</span>
            <h2 className="text-2xl font-light mb-8 text-white tracking-wide">Bilimsel Operasyonlar</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
               <div className="border border-white/10 p-6 flex flex-col gap-4">
                 <h4 className="text-base uppercase tracking-widest font-light text-white">AI ve Robotik</h4>
                 <p className="text-white/50 text-sm text-justify leading-relaxed">İnsanlardan önce robotlar üs kurma ve kazıyı yapay zeka ile yürütecektir.</p>
               </div>
               <div className="border border-white/10 p-6 flex flex-col gap-4">
                 <h4 className="text-base uppercase tracking-widest font-light text-white">Ay Jeolojisi</h4>
                 <p className="text-white/50 text-sm text-justify leading-relaxed">Çekirdeği incelenerek Dünya’nın erken tarihi de anlaşılacaktır.</p>
               </div>
               <div className="border border-white/10 p-6 flex flex-col gap-4">
                 <h4 className="text-base uppercase tracking-widest font-light text-white">Astronomi</h4>
                 <p className="text-white/50 text-sm text-justify leading-relaxed">Karanlık yüzü, Dünya radyo sinyallerinden uzak dev teleskoplar için harikadır.</p>
               </div>
               <div className="border border-white/10 p-6 flex flex-col gap-4">
                 <h4 className="text-base uppercase tracking-widest font-light text-white">Biyomedikal</h4>
                 <p className="text-white/50 text-sm text-justify leading-relaxed">Düşük yerçekimi ortamında insan vücudunun sınırları uzun vadeli test edilecektir.</p>
               </div>
            </div>
          </div>

          <QuizLock
            question="Ay jeolojisi üzerine yapılacak sondajlar ve derin araştırmalar, aynı zamanda hangi gezegenin 'erken tarihini' anlamamızı sağlayacak?"
            options={["Mars", "Güneş", "Dünya", "Venüs"]}
            correctAnswerIndex={2}
          >
            <div className="mb-20">
              <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">Vizyon</span>
              <h2 className="text-2xl font-light mb-8 text-white tracking-wide">Merkez Üs Konsepti</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
                  <ArrowRight className="w-5 h-5 text-white/40 mb-6" />
                  <h3 className="text-base uppercase tracking-widest font-light mb-4 text-white">Ara Durak / Uzay Üssü</h3>
                  <p className="text-white/50 text-sm text-justify leading-relaxed">Ay, Mars ve daha uzak hedeflere yapılacak görevler için yakıt ikmali ve lojistik destek sağlayan köprü olacaktır.</p>
                </div>
                <div className="border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
                  <DollarSign className="w-5 h-5 text-white/40 mb-6" />
                  <h3 className="text-base uppercase tracking-widest font-light mb-4 text-white">Uzay Ekonomisi</h3>
                  <p className="text-white/50 text-sm text-justify leading-relaxed">Özel şirketler, uyduda madencilik ve ticari hatlar inşa etmektedir. Hukuki ve etik sözleşmeler devrededir.</p>
                </div>
              </div>

              <div className="mt-12 p-8 border border-white/20 text-center">
                <p className="text-lg text-white font-light max-w-2xl mx-auto leading-loose tracking-wide">
                  Bu çalışmalar Ay’ı sadece gözlem hedefi olmaktan çıkarıp insanlığın uzaydaki ilk kalıcı üretim merkezi haline getirmeyi amaçlamaktadır.
                </p>
              </div>
            </div>
          </QuizLock>
        </QuizLock>

      </div>
    </ArticleLayout>
  );
}
