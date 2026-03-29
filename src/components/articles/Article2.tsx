import { Moon, Eye, BookOpen, Clock } from "lucide-react";
import ArticleLayout from "./ArticleLayout";
import QuizLock from "./QuizLock";

export default function Article2({ onBack }: { onBack: () => void }) {
  return (
    <ArticleLayout onBack={onBack} bgImageUrl="/bg2.png">
      
      <div className="w-full max-w-4xl mx-auto px-6 py-24 text-white/80 font-light">
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">Bölüm II</span>
          <h1 className="text-3xl md:text-5xl font-light tracking-wide text-white">Ay ve İnanç</h1>
          <div className="w-px h-16 bg-white/20 mx-auto mt-12" />
        </div>
        
        <div className="mb-20">
          <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">M.Ö. 35.000 - 10.000</span>
          <h2 className="text-2xl font-light mb-6 text-white tracking-wide">İlk İzler (Paleolitik Dönem)</h2>
          <p className="text-white/70 leading-[1.8] text-justify">
            Üst Paleolitik dönemde inançlar doğa olaylarıyla iç içeydi. Ay'ın her ay yok olup tekrar doğması, o dönem insanı için "ölüm ve yeniden doğum" kavramının ilk somut kanıtıydı. Araştırmacı Alexander Marshack'ın analizlerine göre, Güney Fransa'daki mağara oymalarında yer alan ay döngüsü sembolleri sıradan bir takvim değil, doğumu ve ölümü simgeleyen karmaşık bir mitoloji diliydi.
          </p>
        </div>
        
        <div className="mb-20">
          <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">M.Ö. 4000 - 2000</span>
          <h2 className="text-2xl font-light mb-6 text-white tracking-wide">Sümer & Babil</h2>
          <p className="text-white/70 leading-[1.8] text-justify">
            Mezopotamya inancına göre Güneş tanrısı Utu, Ay Tanrısı Nanna'nın çocuğudur. Yani gece gündüzden önce gelir. Babillerde Ay tanrısına 'Sin' denirdi. Babiller, Ay tutulmalarını iblislerin ayın ışığını çalmaya çalışması olarak görür ve Sin'in bu kozmik karanlık güçlerle savaşarak düzeni yeniden sağladığına inanırdı.
          </p>
        </div>

        <div className="mb-20">
          <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">M.Ö. 3000 - 30</span>
          <h2 className="text-2xl font-light mb-6 text-white tracking-wide">Mısır: Horus'un Gözü ve Zamanın Ölçücüsü</h2>
          <p className="text-white/70 leading-[1.8] text-justify mb-12">
            Mısır mitolojisinde Ay tek tanrıyla değil, üç farklı karakterle temsil edilirdi. Mısırlılar için Ay, evrenin düzenini koruyan ilahi bir muhasebeciydi. Seth ile savaşan Horus sol gözünü (Ay'ı) kaybedince Thoth bu parçaları bulup iyileştirir. "Wedjat" (Horus'un Gözü) bu yüzden koruyucu bir tılsım olmuştur.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border border-white/10 bg-white/5 p-8 flex flex-col items-center text-center">
              <BookOpen className="w-8 h-8 text-white/60 mb-6" />
              <h3 className="text-base uppercase tracking-widest font-light mb-2 text-white">Thoth</h3>
              <p className="text-sm text-white/50 leading-relaxed">Bilgelik, yazı ve zamanın tanrısı. Takvimi o oluşturmuştur.</p>
            </div>
            <div className="border border-white/10 bg-white/5 p-8 flex flex-col items-center text-center">
              <Eye className="w-8 h-8 text-white/60 mb-6" />
              <h3 className="text-base uppercase tracking-widest font-light mb-2 text-white">Horus'un Gözü</h3>
              <p className="text-sm text-white/50 leading-relaxed">Her ay parçalanıp iyileşen göz, evrelerin açıklamasıdır.</p>
            </div>
            <div className="border border-white/10 bg-white/5 p-8 flex flex-col items-center text-center">
              <Clock className="w-8 h-8 text-white/60 mb-6" />
              <h3 className="text-base uppercase tracking-widest font-light mb-2 text-white">Khonsu</h3>
              <p className="text-sm text-white/50 leading-relaxed">Ay'ın gezgin ruhudur. Gece hareket edip şifa dağıtan form.</p>
            </div>
          </div>
        </div>

        <QuizLock
          question="Mısır inancında parçalanıp tekrar birleşerek Ay'ın evrelerine zemin hazırlayan mitolojik olay hangisidir?"
          options={["Dünya Ağacının Dökülmesi", "Horus'un Gözünün İyileşmesi", "Thoth'un Asasını Kırması", "Khonsu'nun Çarpışması"]}
          correctAnswerIndex={1}
        >
          <div className="mb-20">
            <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">M.Ö. 800 - M.S. 400</span>
            <h2 className="text-3xl font-light mb-6 text-white tracking-wide">Antik Yunan ve Roma</h2>
            <div className="space-y-6 text-white/70 leading-[1.8] text-justify mb-10">
              <p>Antik Yunan ve Roma'da Ay, zamanın yöneticisi ve dişilliğin sembolü olarak üçlü yapıyla anılmıştır: Artemis/Diana (Erken/Bakire Hilal, gençliği koruyan), Selene/Luna (Dolunay, gökyüzünde gümüş arabayla dolaşan olgunluk sembolü) ve Hekate/Trivia (Yeni Ay, büyü ve yeraltı kapılarının koruyucusu).</p>
            </div>
            
            <div className="border border-white/10 bg-transparent p-8 mb-10 text-justify">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4 block">İnanışlar</span>
              <p className="text-white/70 leading-[1.8]">
                Roma'da Ay Çarpması (Lunacy): Romalılar, dolunayın insan zihnindeki nem oranını artırarak deliliğe veya korkutucu epilepsi krizlerine yol açtığına inanıyordu. İngilizce "Lunatic" (aylak/deli) kelimesi Roma Ay Tanrıçası Luna'dan gelir. Su etkisini gören çiftçiler "büyüyen ayda ek, küçülen ayda kes" inancını doğurmuştur.
              </p>
            </div>

            <QuizLock
              question="Romalıların dolunayın deliliğe sürüklediğine inanması sonucu modern dillere dahi geçen kelime nedir?"
              options={["Artemisia", "Lunatic", "Hekatizm", "Epileptik"]}
              correctAnswerIndex={1}
            >
              <div className="mb-20">
                <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">M.S. 622 - Günümüz</span>
                <h2 className="text-2xl font-light mb-6 text-white tracking-wide">İslam Medeniyeti</h2>
                <p className="text-white/70 leading-[1.8] text-justify mb-10">
                  İslam inancında Ay, tapınılacak bir varlık değil, zamanı belirlemek için bir ölçüdür. İbadetlerin kameri aylara göre düzenlenmesi, bilginleri astronomide zirveye taşıdı. Camilerdeki Muvakkitler Ay gözlemleri için özel rasathaneler kurdular. Siyasi sembol olarak "Hilal" motifi Haçlı Seferleri döneminde Hristiyan Haçı'na karşı bir bayrak/kimlik olarak yaygınlaşmıştır.
                </p>
                
                <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">M.S. 1000 - Günümüz</span>
                <h2 className="text-2xl font-light mb-6 text-white tracking-wide">Uzak Doğu (Çin/Japonya)</h2>
                <p className="text-white/70 leading-[1.8] text-justify">
                  Çin kozmolojisinde Ay evrendeki dişil enerjiyi (Yin) ve ölümsüzlüğü temsil eder. Mitolojide ölümsüzlük iksirini içip Ay'a çıkan Tanrıça Chang'e ve Ay'daki kraterleri oluşturan "Ölümsüzlük Tavşanı" inancı yaygındır. Japonya'da nadir görülen şekilde Ay tanrısı erildir (Tsukuyomi). "Güz Ortası Festivali (Ay Çöreği)" gibi şenliklerde aile birliği yüceltilir.
                </p>
              </div>
            </QuizLock>
          </div>
        </QuizLock>
      </div>

    </ArticleLayout>
  );
}
