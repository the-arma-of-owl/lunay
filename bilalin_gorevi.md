# Bilal'in Görevi

## Proje Bağlamı ve Mimari
Mevcut proje **React + Vite + TypeScript (TSX) + Tailwind CSS + Framer Motion (`motion/react`)** kullanılarak geliştirilmektedir.
Geliştireceğin yeni özelliklerin proje bütünüyle uyumlu olması için aynı kodlama mimarisini (tasarım için Tailwind utility class'ları ve etkileşimli animasyonlar için Framer Motion) kullanmalısın. Geliştirilecek bileşenler `src/components/` gibi uygun bir klasör yapısına eklenmeli ve mevcut yönlendirme yapısına (örneğin `App.tsx` içerisindeki render mantığına) entegre edilmelidir.

## Görev Tanımı: "True Size Of / Gerçek Boyut" Oyunu
Bu görevde, kullanıcılara Dünya ve Ay'ın boyutlarını sezgisel olarak kavratacak iki modlu, interaktif ve eğlenceli bir oyun bileşeni (örneğin `TrueSizeGame.tsx`) geliştireceksin. Bu oyun, anasayfadaki "Kıyaslama Oyunu" menüsünden erişilebilir olacak şekilde kurgulanmalıdır.

### Mod 1: Meyve Kıyaslaması (Quiz)
- **Mantık:** Ekranda Dünya'yı temsil eden bir meyve (örneğin "Karpuz") gösterilir.
- **Soru:** "Eğer Dünya bir Karpuz büyüklüğünde olsaydı, sizce Ay aşağıdakilerden hangisi olurdu?"
- **Seçenekler:** Üzüm, Portakal, Şeftali, Bezelye vb. çeşitli meyve ikonları veya görselleri (Dünya yarıçapı ~6371 km, Ay yarıçapı ~1737 km. Bu da Ay'ın Dünya'dan çap olarak yaklaşık 1/3.67 oranında olduğu anlamına gelir. Doğru cevap oransal olarak buna en yakın olan meyvedir, örn: Üzüm veya küçük bir Erik/Ceviz).
- **Etkileşim:** Kullanıcı yanlış bir meyve seçtiğinde, o seçenekte Framer Motion ile hafif bir hata/titreme (shake) animasyonu olmalı ve seçenek görsel olarak elenmelidir. Doğru meyveyi seçtiğinde ise ekranda tebrikler/kutlama efekti belirmeli ve otomatik olarak 2. moda (Mod 2) geçiş yapılmalıdır.

### Mod 2: Serbest Sürükleme ve Gerçek Boyut (Drag & Scale)
- **Mantık:** Ekranda Dünya ve Ay görselleri ilk bakışta **aynı boyutta (aynı zoom seviyesinde, 1:1)** bulunur.
- **Etkileşim:** Kullanıcı bu görsellerden birini tutup "Evren (Canvas/Oyun Alanı)" alanına sürüklediğinde (Framer Motion `drag` özelliği kullanılmalıdır), görseller sürüklendiği an "Gerçek Göreceli Boyutlarına" (scale animasyonu ile pürüzsüzce) dönüşmelidir.
- **Beklenen Davranış:** Dünya canvas alanına sürüklendiğinde, orantılı ve gerçekçi olması adına örneğin mevcut halinin 3.67x katı kadar büyümeli; Ay ise canvas alanına sürüklendiğinde (veya Dünya'nın yanındayken) Dünya'ya kıyasla kendi gerçek oranını yansıtacak şekilde 1x boyutunda kalmalı (veya hesaba göre tam tersi ölçeklenmeli). Böylece kullanıcı, Dünya haritaya devasa bir şekilde otururken Ay'ın yanındaki küçüklüğünü kendi etkileşimiyle deneyimlemiş olacaktır.

## İstenen Çıktı ve Kabul Kriterleri
1. `src/components/TrueSizeGame.tsx` dosyasının (ve gerekli olabilecek alt bileşenlerin) oluşturulması.
2. Tüm kullanıcı etkileşimlerinin React state (`useState`) kullanılarak adım adım (Quiz -> Drag) yönetilmesi.
3. Menü (`App.tsx` içindeki `SECTIONS` dizisine eklenen "Kıyaslama Oyunu" bölümü) ile oyun bileşeni bağlantısının kurulması.
4. UI/UX'in mevcut uzay, siyah arka plan (dark mode), beyaz sade fontlar tasarım diline tam uyumlu geliştirilmesi.
