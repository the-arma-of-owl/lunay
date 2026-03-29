import { Moon, Eye, BookOpen, Clock, Activity } from "lucide-react";
import ArticleLayout from "./ArticleLayout";
import QuizLock from "./QuizLock";

export default function Article1({ onBack }: { onBack: () => void }) {
  return (
    <ArticleLayout onBack={onBack} bgImageUrl="/bg1.png">
      <div className="w-full max-w-4xl mx-auto px-6 py-24 text-white/80 font-light">
        
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">Bölüm I</span>
          <h1 className="text-3xl md:text-5xl font-light tracking-wide text-white">
            Geçmişten Günümüze Ay
          </h1>
          <div className="w-px h-16 bg-white/20 mx-auto mt-12" />
        </div>

        {/* 1. MÖ 3000 - 2000 Mezopotamya */}
        <div className="mb-20">
          <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">MÖ 3000 - 2000</span>
          <h2 className="text-2xl font-light mb-8 text-white tracking-wide">Mezopotamya (Sümer / Babil)</h2>
          <div className="space-y-6 text-white/70 leading-[1.8] text-justify">
            <p>Mezopotamya panteonunda Ay Tanrısı (Nanna/Sin), Güneş Tanrısı Utu'nun babasıdır. Bu, karanlığın ışıktan önce geldiği inancını yansıtır. Sümerler ve Babilliler, doğadaki döngüleri anlamlandırmak için Ay'ın evrelerini temel alarak Ay Takvimini geliştirdiler (29.5 Günlük Döngü). Ay yılı (354 gün) ile Güneş yılı (365 gün) arasındaki farkı kapatmak için "artık ay" ekleme sistemini buldular.</p>
            <p className="pl-6 border-l border-white/20 italic">Siyasi ve Sosyal Etkileşim: "İkame Kral" Ritüeli. Ay tutulması, Tanrı Sin'in krala kızdığı ve onu cezalandıracağı şeklinde yorumlanırdı. Tutulma yaklaştığında gerçek kral tahtından iner, yerine sıradan bir vatandaş "sahte kral" olarak oturtulurdu. Felaketin bu sahte krala isabet etmesi beklenir, tutulma geçtikten sonra sahte kral öldürülür ve gerçek kral tahtına dönerdi.</p>
            <p>Tarım ve Ekonomi: Nehir seviyelerindeki değişimlerin gelgit etkisiyle bağlantılı olduğu fark edildi. Dolunay ışığı gece mesaisine izin verdiği için Ay'a "işçilerin dostu" denilmiştir.</p>
          </div>
        </div>

        {/* 2. MÖ 2500 - 1500 Mısır */}
        <div className="mb-20">
          <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">MÖ 2500 - 1500</span>
          <h2 className="text-2xl font-light mb-8 text-white tracking-wide">Antik Mısır</h2>
          <div className="space-y-6 text-white/70 leading-[1.8] text-justify">
            <p>Mısır panteonunda Ay; Thoth (Bilgelik ve Yazı Tanrısı), Khonsu (Ay'ın Gezgini) ve Iah (Saf Ay) olarak üç tanrı ile temsil edilirdi. Thoth, hiyeroglifleri icat eden ve zamanı ölçen tanrıydı. İbis kuşu kafasıyla betimlenirdi.</p>
            <p>Horus'un Gözü (Wadjet): Seth, Horus'un sol gözünü (Ay'ı) çıkarıp parçalara ayırır. Thoth bu parçaları bir araya getirerek iyileştirir. Ay'ın her ay küçülüp büyümesi (evreleri), Horus'un gözünün parçalanması ve Thoth tarafından her ay yeniden tamamlanması (dolunay) olarak açıklanırdı. Ayrıca Ay'ın sürekli ölüp doğması, Mısırlıların ölümden sonraki yaşam inancıyla mükemmel bir uyum içindeydi.</p>
          </div>
        </div>

        {/* 3. MÖ 800 - MS 400 Yunan/Roma */}
        <div className="mb-20">
          <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">MÖ 800 - MS 400</span>
          <h2 className="text-2xl font-light mb-8 text-white tracking-wide">Antik Yunan ve Roma</h2>
          <div className="space-y-6 text-white/70 leading-[1.8] text-justify">
            <p>Üçlü Tanrıça Kültü: Artemis/Diana (Hilal - Bakire avcı), Selene/Luna (Dolunay - Olgunluk), Hekate/Trivia (Yeni Ay - Karanlık, Büyü Tanrıçası). Anaksagoras MÖ 5. yy'da Ay'ın kendi ışığı olmadığını, Güneş'ten aldığını öne sürmüştür. Aristarkus ise Ay'ın Dünya'ya uzaklığını hesaplamaya çalışmıştır. Antikythera Mekanizması isimli ilk analog bilgisayar Ay evrelerini hesaplamak için kullanılmıştır.</p>
            <p>Lunatik Kavramı: Romalılar dolunayın insan zihnindeki nem oranını artırarak deliliğe veya epilepsi krizlerine yol açtığına inanırdı. İngilizcedeki "Lunatic" (deli) kelimesi Roma Ay tanrıçası Luna'dan gelir. Ayrıca askerler tutulmaları tanrıların desteğini çekmesi olarak yorumlayıp korkarlardı.</p>
          </div>
        </div>

        <QuizLock 
          question="Romalıların dolunayın insanları delirttiğine inanması sonucu, günümüze kadar ulaşan 'deli/aylak' anlamındaki kelime hangisidir?"
          options={["Astronomi", "Lunatik", "Maniak", "Selanik"]}
          correctAnswerIndex={1}
        >
          {/* Çin, İslam, Maya */}
          <div className="mb-20">
            <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">MÖ 200 - Günümüz</span>
            <h2 className="text-2xl font-light mb-8 text-white tracking-wide">Doğu ve İslam Medeniyeti</h2>
            <div className="space-y-6 text-white/70 leading-[1.8] text-justify">
              <p>Yin ve Yang: Ay, "Yin" prensibini (dişil, serin, pasif) temsil eder. Güneş (Yang) eril iken Ay dişildir. Mitolojide Ay Tanrıçası Chang'e ve Ay'daki lekelerin benzeltildiği "Yeşim Tavşan" efsaneleri vardır. Çin'in en büyük bayramlarından Güz Ortası Festivalinde yenilen "Ay Çöreği" (Mooncake) dolunayın tam yuvarlak şeklini ve ailenin birleşmesini simgeler.</p>
              <p>Kur'an-ı Kerim'de Ay, tapınılacak bir nesne değil, Allah'ın varlığına delil olan bir araçtır ve temel işlevi vakit ölçüsü olmaktır. İbadetlerin Ay döngüsüne göre belirlenmesi, İslam dünyasında astronominin zirveye ulaşmasını sağladı. "Rü’yet-i Hilal" takibi için usturlaplar ve rasathaneler gelişti. Minarelerdeki hilal alemleri ve şiirlerdeki "Bedir / Dolunay" benzetmeleri kültürün ayrılmaz bir parçası oldu.</p>
              <p>MS 700 - 1200 Maya ve Aztekler: Mayalar Ay'ın evresinin tam 29.53059 gün sürdüğünü çıplak gözle muazzam bir hassasiyetle hesapladı (modern ölçüm 29.530588). Ay, Tanrıça Ix Chel (Tanrıça I) ile temsil edilirdi. Azteklerde ise Ay Tanrıçası Coyolxauhqui'nin kardeşi tarafından parçalanıp göğe atıldığına ve her ay küçülüp yok olmasının bu savaşın tekrarı olduğuna inanılırdı.</p>
            </div>
          </div>

          <QuizLock
            question="Mayalar, çıplak gözle yaptıkları asırlık gözlemler sonucunda Ay'ın bir evresinin ne kadar sürdüğünü son derece keskin bir şekilde nasıl hesaplamışlardır?"
            options={["24.00000 Gün", "29.53059 Gün", "31.11223 Gün", "15.00000 Gün"]}
            correctAnswerIndex={1}
          >
            {/* Galileo ve Luna 2 */}
            <div className="mb-20">
              <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">1609</span>
              <h2 className="text-2xl font-light mb-8 text-white tracking-wide">Galileo Galilei</h2>
              <div className="border border-white/10 bg-white/5 p-8 mb-16 text-justify leading-[1.8] text-white/70">
                <p>Galileo gözlemlerini "Sidereus Nuncius" (Yıldız Habercisi) adlı eserinde topladı. Ay’ın pürüzsüz olmadığını; tıpkı Dünya gibi engebeli, çukurlarla dolu ve dağlık olduğunu kanıtladı. Işık ve gölge analiziyle buralardaki tepeleri haritalandırdı. Ayrıca Ay'ın karanlık kısmının hafif parlamasını (Dünya Işığı - Earthshine) Dünya'dan Ay'a yansıyan ışık olarak açıkladı. Yaptığı teleskopik çizimler, Aristoteles kozmolojisini ve "kusursuz cisimler" inancını yerle bir etti.</p>
              </div>

              <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">1959</span>
              <h2 className="text-3xl font-light mb-8 text-white tracking-wide">SSCB - Luna 2</h2>
              <div className="space-y-6 text-white/70 leading-[1.8] text-justify">
                <p>12 Eylül 1959'da fırlatılan uzay aracı, 14 Eylül'de Ay yüzeyine (Mare Imbrium'a) yaklaşık 12.000 km/sa hızla sert bir çarpışma yaptı. Manyetik alan keşfi: Ay'ın manyetik alanının olmadığını kanıtladı. Sovyetler bu tarihi başarıyı kalıcılaştırmak için dâhiyane bir yöntem buldu: Luna 2'nin içinde üzerinde SSCB arması (Orak-Çekiç) bulunan çelik küreler vardı. Çarpmadan hemen önce patlayıcı mekanizma devreye girdi ve bu madalyonları şarapnel gibi Ay'a saçtı.</p>
              </div>
            </div>

            <QuizLock 
              question="Luna 2 aracının Ay'a sert çarpışma yapmadan hemen önce yüzeye 'imza' olarak dağıttığı nesneler nelerdi?"
              options={["Kızıl Bayrak Sembolleri", "SSCB Armalı Çelik Küreler", "Matruşka Bebekleri", "Uzay Kameraları"]}
              correctAnswerIndex={1}
            >
              {/* ABD - Apollo 11 */}
              <div className="mb-20">
                <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">1969</span>
                <h2 className="text-3xl font-light mb-8 text-white tracking-wide">ABD - Apollo 11</h2>
                <div className="space-y-6 text-white/70 leading-[1.8] text-justify mb-10">
                  <p>16 Temmuz 1969'da fırlatılan Apollo 11, Neil Armstrong ve Buzz Aldrin'i Ay'a taşıdı. 2,5 saat yüzeyde kaldılar. Dünya çapında 600 milyon kişi canlı izledi. "Erken Apollo Bilimsel Deney Paketi" (EASEP) dahilinde Lazer Mesafe Ölçüm Aynası, Sismometre ve Güneş rüzgarı panelleri kurdular.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="border border-white/10 bg-white/5 p-8">
                    <h3 className="text-base uppercase tracking-widest font-light mb-4 text-white">EASEP Deneyleri</h3>
                    <p className="text-white/50 leading-relaxed text-sm">Aynalar sayesinde Ay-Dünya mesafesi milimetrik ölçülmeye başlandı. Sismometre ay depremlerini kaydetti.</p>
                  </div>
                  <div className="border border-white/10 bg-white/5 p-8">
                    <h3 className="text-base uppercase tracking-widest font-light mb-4 text-white">Örnekler</h3>
                    <p className="text-white/50 leading-relaxed text-sm">Ay'ın 4,5 milyar yaşında olduğu anlaşıldı. Armalcolit gibi daha önce Dünya'da olmayan mineraller keşfedildi.</p>
                  </div>
                  <div className="border border-white/10 bg-white/5 p-8">
                    <h3 className="text-base uppercase tracking-widest font-light mb-4 text-white">Manuel İniş</h3>
                    <p className="text-white/50 leading-relaxed text-sm">Otomatik pilot kayalıklara iniyordu, Armstrong yakıt bitimine 30 saniye kala manuel ustalıkla aracı indirdi.</p>
                  </div>
                </div>

                <p className="text-white/70 leading-[1.8] text-justify">
                  Ay modülünün ayağına monte edilen plakette şu yazıyordu: "Dünya gezegeninden gelen insanlar, Ay'a ilk kez ayak bastılar. Tüm insanlık adına barış içinde geldik." Astronotlar dönüşte mikroorganizma taşımadıklarından emin olmak için 21 gün karantinada tutuldular.
                </p>
              </div>
            </QuizLock>
          </QuizLock>
        </QuizLock>

      </div>
    </ArticleLayout>
  );
}
