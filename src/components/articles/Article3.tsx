import { Rocket, Globe, Star, Navigation } from "lucide-react";
import ArticleLayout from "./ArticleLayout";
import QuizLock from "./QuizLock";

export default function Article3({ onBack }: { onBack: () => void }) {
  return (
    <ArticleLayout onBack={onBack} bgImageUrl="/bg3.png">
      <div className="w-full max-w-4xl mx-auto px-6 py-24 text-white/80 font-light">
        
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">Bölüm III</span>
          <h1 className="text-3xl md:text-5xl font-light tracking-wide text-white">
            Günümüzde Ay (Modern Çağ)
          </h1>
          <div className="w-px h-16 bg-white/20 mx-auto mt-12" />
        </div>

        <div className="mb-20">
          <p className="text-lg leading-[1.8] text-white/70 text-justify mb-10">
            Güncel çalışmaların ana motivasyonu, bilimsel merakı doyurmanın ötesinde hayati kaynaklara sahip olabilmektir. Bu kaynakların en değerlisi Ay'ın karanlık kraterlerinde bulunan Su Buzu'dur. Bu hidrojen ve oksijene ayrıştırılıp paha biçilemez bir roket yakıtı yapmak için aranmaktadır. Bir diğer kritik kaynak ise Dünya'da neredeyse hiç olmayan temiz nükleer füzyon devrimini başlatabilecek Helyum-3 izotopudur.
          </p>

          <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">NASA</span>
          <h2 className="text-2xl font-light mb-8 text-white tracking-wide flex items-center gap-4">
            <Rocket className="w-6 h-6 text-white/40" /> Artemis Programı
          </h2>
          <div className="space-y-6 text-white/70 leading-[1.8] text-justify mb-10">
            <p>Artemis, 1972 yılından bu yana Ay'a ayak basmayan insanlığı, "bu sefer kalıcı olarak" Ay üslerine (özellikle güney kutbuna) yerleştirmeyi hedefliyor. Bununla da yetinmeyerek, yörüngede "Lunar Gateway" isimli bir uzay terminali kuracaklar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="border border-white/10 bg-white/5 p-8">
              <h4 className="text-base uppercase tracking-widest font-light mb-4 text-white">Artemis I (2022)</h4>
              <p className="text-white/50 leading-relaxed text-sm">Ocak 2022'de tamamlanan görevde mürettebatsız Orion kapsülü Ay'ın etrafından dolanıp başarıyla Dünya'ya geri döndü.</p>
            </div>
            <div className="border border-white/10 bg-white/5 p-8">
              <h4 className="text-base uppercase tracking-widest font-light mb-4 text-white">Artemis II (2025/2026)</h4>
              <p className="text-white/50 leading-relaxed text-sm">Ay yörüngesine gidecek devrimi temsil eder. Mürettebatı içerisinde ilk kez bir kadın ve bir siyahi astronot bulunmaktadır.</p>
            </div>
          </div>
        </div>

        <QuizLock
          question="Artemis programı dahilinde planlanan 'Artemis II' görevini daha önceki Ay görevlerinden belirgin kılan yenilik (ilk) nedir?"
          options={["Robot astronot taşımak", "Mars'tan direkt dönüş yapmak", "Mürettebatta ilk kez kadın ve siyahi astronota yer verilmesi", "Uzay aracının ahşaptan olması"]}
          correctAnswerIndex={2}
        >
          {/* Çin ve Diğerleri */}
          <div className="mb-20">
            <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">Çin Ulusal Uzay İdaresi (CNSA)</span>
            <h2 className="text-2xl font-light mb-8 text-white tracking-wide flex items-center gap-4">
              <Star className="w-6 h-6 text-white/40" /> Chang’e Başarıları
            </h2>
            <div className="space-y-6 text-white/70 leading-[1.8] text-justify mb-10">
              <p>Çin, Ay araştırmalarında son derece istikrarlı projelere imza attı. Chang’e programı 2030'lu yıllarda Rusya ile ILRS (Uluslararası Ay Araştırma İstasyonu) kurulumlarını başlatacak.</p>
              <div className="border-l border-white/20 pl-6 my-8">
                <p className="mb-4"><strong className="text-white block mb-1 font-light tracking-wide">Chang’e 4 (2019)</strong> Ay'ın karanlık yüzüne (South Pole-Aitken havzası) tekerlek koyabilen tarihteki ilk araç olarak insanüstü bir mühendislik örneği sergiledi.</p>
                <p><strong className="text-white block mb-1 font-light tracking-wide">Chang’e 5 (2020) & Chang'e 6 (2024)</strong> 40 yıllık hasrete son verip Ay'dan (karanlık yüzü de dahil) kaya örneği kazıp Dünya'ya ulaştıran efsane misyonlar.</p>
              </div>
            </div>
          </div>

          <QuizLock
            question="Ay'ın Dünya'dan görünmeyen ve iletişim kurulamayan 'karanlık yüzüne' başarıyla ilk inişi yapan araç hangisidir?"
            options={["Artemis I", "Apollo 13", "Starship", "Chang’e 4"]}
            correctAnswerIndex={3}
          >
            <div className="mb-20">
              <span className="text-xs tracking-[0.2em] text-white/50 uppercase block mb-4">Yeni Oyuncular</span>
              <h2 className="text-2xl font-light mb-8 text-white tracking-wide flex items-center gap-4">
                <Navigation className="w-6 h-6 text-white/40" /> Uzayda Değişen Dengeler
              </h2>
              
              <div className="space-y-12">
                <div>
                  <h3 className="text-base uppercase tracking-widest font-light mb-4 text-white">Hindistan ve Japonya</h3>
                  <div className="border border-white/10 bg-transparent p-8 text-white/70 leading-[1.8] text-justify">
                    <p>
                      2023 yılında <strong>Chandrayaan-3</strong> (Hindistan), çok düşük bir bütçeyle Ay'ın su dolu zorlu Güney Kutbuna inen ilk ülke oldu. 2024'te ise Japonya'nın <strong>SLIM</strong> aracı, hesapladığı noktaya sadece 100 metrelik hata payıyla inerek tarihin en kusursuz isabetli inişini kaydetti.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base uppercase tracking-widest font-light mb-4 text-white">SpaceX ve Ticari Yarış</h3>
                  <div className="border border-white/10 bg-transparent p-8 text-white/70 leading-[1.8] text-justify">
                    <p>
                      Artık NASA bile biletleri özel şirketlerden satın almaya başladı. Intuitive Machines (Odysseus aracı) bunun ilk örneklerindendir. Dahası NASA, Artemis III göreviyle insanları Ay'a indirmek için özel şirket SpaceX'in dev <strong>Starship</strong> modelini "Ay Kondusu" olarak atadı.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </QuizLock>
        </QuizLock>

      </div>
    </ArticleLayout>
  );
}
