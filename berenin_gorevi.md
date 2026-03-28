# Beren'in Görevi

## Projenin Amacı ve Bağlamı
Mevcut projemiz **React + Vite + TypeScript (TSX)** üzerine inşa ediliyor. Stil ve etkileşimler için `Tailwind CSS` ve `Framer Motion` kullanıyoruz. Bu görevde, geçmişten günümüze Ay haritalarını ve insanların Ay'ı algılayış biçimini anlatan tarihi/teknik bir modül geliştirmen bekleniyor. Geliştireceğin arayüz, anasayfadaki "Geçmişten Günümüze Ay" veya yepyeni bir "Tarihi Haritalar" sekmesinde yer alacak.

## Görev Tanımı: Tarihi Ay Haritaları ve 3D Kıyaslama Küresi
Senin temel görevin, tarihte çizilmiş en önemli Ay haritalarını bulup indirmek ve bunları günümüzün yüksek çözünürlüklü NASA verileriyle karşılaştıran interaktif bir deneyim oluşturmaktır.

### Adım 1: Araştırma ve İçerik Üretimi (Tarihsel Bağlam)
- **Harita Toplama:** Thomas Harriot (1609), Galileo Galilei (1610), Johannes Hevelius (1647) ve Giovanni Battista Riccioli (1651) gibi astronomların çizdiği tarihi Ay haritalarını ve günümüz yüksek çözünürlüklü Ay haritasını (LRO - Lunar Reconnaissance Orbiter) bulmalısın.
- **Analiz ve Hikayeleştirme:** "Bu haritayı çizen kişi neden böyle çizdi?", "Dönemin teleskopik kısıtlamaları nelerdi?", "Kraterleri veya Ay denizlerini (Maria) o günün şartlarında neye benzettiler?" gibi soruları yanıtlayan kısa, ilgi çekici metinler yazmalısın. Örneğin, Riccioli'nin denizlere verdiği Latince isimler (Sükunet Denizi, Krizler Denizi) veya yeryüzü şekillerini yanlış algılamaları projede anlatılmalı.
- **Entegrasyon:** Bulduğun tüm haritaları `public/assets/` klasörüne uygun şekilde kaydetmeli ve içerikleri bir JSON / TypeScript dosyası (`src/data/historicalMaps.ts`) olarak projeye eklemelisin.

### Adım 2: Teknik Geliştirme (3D Globe Üzerinde Karşılaştırma)
Bu projenin en çok parlayacak olan, senin teknik becerilerini göstereceğin kısımdır. Tarihi 2D çizimleri bir şekilde işleyerek, **gerçek bir 3D küre (Globe)** üzerine "texture (kaplama)" olarak sarmalı ve günümüz haritası ile kıyaslanabilir hale getirmelisin.
- **Kullanılabilecek Teknolojiler:** Proje React olduğu için **`recharts`** gibi araçlar yerine, doğrudan 3 boyutlu bir alan açan **`@react-three/fiber`**, **`three.js`** veya React uyumlu **`react-globe.gl`** / **`globe.gl`** kütüphanelerinden birini tercih etmelisin. 
- **Etkileşim (Öneri):** Ekranda dönen 3D bir Ay küresi olur. Ekranda bir "Slider (Kaydırıcı)" veya "Zaman Çizelgesi (Timeline)" bulunur. Kullanıcı slider'ı 1610 yılına (Galileo'ya) getirdiğinde, 3D küre üzerindeki kaplama (texture) pürüzsüz bir animasyonla (fade) Galileo'nun haritasına dönüşür. Slider 2024 (Günümüz) yılına getirildiğinde ise kaplama NASA'nın gerçekçi yüzeyine döner.
- **Ekstra Karşılaştırma Fikri:** Eğer 3D küre zorlarsa veya ek olarak eklemek istersen, "Image Compare Slider" (Ortadan ikiye bölünen ve sağa sola çekilerek aynı noktanın eski/yeni halini gösteren bileşen) mantığı da kurabilirsin. Ancak önceliğimiz 3D Globe olmalı.

## Beklenen Çıktılar ve Adımlar
1. `public/assets/maps/` içerisine toplanan tarihi ve güncel haritalar (özellikle Sphere Mapping / Equirectangular formata uygun hale getirilmiş kare veya silindirik görseller).
2. `src/data/historicalMaps.ts` verisinin hazırlanması (Harita yılı, çizen kişi, dönemin algısı ve farklar vb.).
3. `src/components/HistoricalMoonGlobe.tsx` (veya benzer isimli) React bileşeninin, 3D entegrasyonu başarıyla yapılarak oluşturulması.
4. Bu modülün ana uygulamaya (menüye veya belirtilen kaydırmalı slider bölümüne) estetik, temanın siyah ağırlıklı uzay tarzına uygun bir UX ile eklenmesi.
