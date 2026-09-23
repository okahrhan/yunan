# Antik Yunan Klasikleri — Kronolojik Okuma Yol Haritası

Homeros'tan Plotinos'a, Antik Yunan edebiyatı ve felsefesinin temel eserlerini **kronolojik** ve **seviyelere ayrılmış** bir okuma yolculuğu olarak sunan, bağımlılıksız statik bir web sitesi.

Site sıradan bir kitap listesi değil; her eser için yazılış tarihini (ve tarihin ne kadar kesin olduğunu), dönemini, türünü, spoiler içermeyen bir özetini, neden önemli olduğunu, okuyunca ne kazandıracağını, okumadan önce bilinmesi gerekenleri ve sonrasında ne okunması gerektiğini anlatan bir rehber.

## Özellikler

- **63 eser, 36 yazar**: MÖ 8. yüzyıldan (İlyada) MS 3. yüzyıla (Enneadlar) kadar.
- **Dört seviye**: Başlangıç → Orta → İleri → Uzman / Derinleşme. Her seviyenin sayfası yalnızca o seviyenin eserlerini kronolojik sırayla ve "Adım" numarasıyla listeler.
- **Kronolojik yol haritası**: Dönem ve yüzyıllara göre gruplanmış, tarihsel olaylarla desteklenmiş dikey zaman çizelgesi; ana sayfada yatay yüzyıl şeridi.
- **Eser kartları**: Temsili kapak (her kategoriye özgü renk ve motif), yazar, tarih, dönem, tür, seviye, kronolojik sıra (№), yıldız puanı ve "Kesinlikle Oku / Önemli / Tavsiye Edilir" etiketleri.
- **Eser detay sayfası**: Künye (yazar, tarih, dönem, tür, tahmini uzunluk, seviye), tarih notu, puan ölçütleri, kısa özet, neden önemli, ne kazanırım, okumadan önce, okuma ipucu, önceki/sonraki okuma zinciri, okuma yollarındaki yeri, yazar bilgisi ve Anadolu bağlantısı.
- **Şeffaf puanlama**: Her eser *tarihsel önem*, *edebî/düşünsel değer* ve *sonraki kültüre etki* ölçütlerinde 1–5 arası puanlanır; yıldız sayısı bu üç puanın ortalamasının yuvarlanmasıdır. Açıklaması sitenin "Rehber" sayfasındadır.
- **7 önerilen okuma yolu**: Yeni başlayanlar, tragedya, felsefe, tarih, mitoloji, pratik felsefe ve edebiyat. Her adımda eserin neden o sırada olduğu açıklanır.
- **Arama ve filtreler**: Türkçe karakter ve farklı yazımlara duyarlı arama (ör. *Eflatun*, *Aristo*, *Ezop*, *Tukididis*); seviye, yazar, dönem, tür, kategori ve okuma durumuna göre filtre; kronolojik/puan/seviye/ada göre sıralama. Filtreler adres çubuğuna yansır, paylaşılabilir. `/` veya `Ctrl+K` ile hızlı arama.
- **Okuma ilerlemesi**: Her eser "Okumadım / Okudum" olarak işaretlenebilir; genel, seviye, yol, kategori ve dönem bazında ilerleme çubukları; sıradaki okuma önerisi; ilerlemeyi dışa/içe aktarma. Veriler yalnızca tarayıcıda (localStorage) tutulur.
- **Klasiklerin haritası**: Natural Earth kıyı çizgileriyle çizilmiş etkileşimli harita; yazarların doğduğu ve çalıştığı yerler, Anadolu bağlantıları.
- **Tasarım**: Mermer dokuları, İon sütunları, meander bandı, lacivert–altın–kırık beyaz paleti; mobil uyumlu, erişilebilir (klavye, odak durumları, `prefers-reduced-motion`).

## Çalıştırma

Derleme adımı yoktur; herhangi bir statik sunucu yeterlidir:

```bash
npm start            # npx serve ile http://localhost:5173
# veya
python3 -m http.server 5173
```

`index.html` dosyası doğrudan tarayıcıda (`file://`) açıldığında da çalışır. GitHub Pages gibi statik barındırma hizmetlerine olduğu gibi yüklenebilir.

## Proje yapısı

```
index.html                 Sayfa iskeleti (başlık, menü, altbilgi, arama penceresi)
css/style.css              Tüm stiller ve tasarım belirteçleri
js/icons.js                SVG sembol kütüphanesi (kapak motifleri + arayüz simgeleri)
js/app.js                  Yönlendirici, bileşenler ve sayfalar
js/data/meta.js            Seviyeler, dönemler, kategoriler, kapak renkleri, puanlama
js/data/authors.js         Yazarlar ve harita yer notları
js/data/books-*.js         Eserler (dönemlere göre dört dosya)
js/data/paths.js           Önerilen okuma yolları ve zaman çizelgesi olayları
js/data/map.js             Otomatik üretilen harita verisi (elle düzenlemeyin)
assets/                    Mermer dokuları, favicon, yerel fontlar (OFL lisanslı)
scripts/validate-data.mjs  Veri doğrulama
scripts/build-map.mjs      Harita verisini Natural Earth'ten üretir
scripts/make-textures.py   Mermer dokularını üretir
```

## Veri modeli

Her eser `js/data/books-*.js` dosyalarından birinde şu alanlarla tanımlanır:

| Alan | Açıklama |
| --- | --- |
| `id` | Adres çubuğunda kullanılan kısa ad (küçük harf, tire) |
| `title`, `subtitle`, `original` | Türkçe ad, isteğe bağlı alt başlık, Yunanca özgün ad |
| `alt` | Aramada tanınacak diğer yazımlar |
| `author` | `authors.js` içindeki yazar anahtarı |
| `date`, `dateNote` | Gösterilen tarih ve kesinlik düzeyini açıklayan not |
| `year` | Sıralama için yıl (MÖ için negatif) |
| `period`, `level`, `categories` | `meta.js` içindeki dönem, seviye ve kategori anahtarları (ilk kategori kapak rengini belirler) |
| `genre`, `length` | Tür ve tahmini uzunluk |
| `scores` | `{ tarih, edebi, etki }` — 1–5 arası; yıldız sayısı ortalamanın yuvarlanmasıdır |
| `motif` | Kapak motifi (`icons.js` içindeki `m-*` sembollerinden biri) |
| `tagline`, `summary`, `importance`, `gains`, `before`, `tip` | Kart ve detay sayfası metinleri |
| `next` | Bundan sonra önerilen eserlerin `id`'leri |

### Yeni eser eklemek

1. İlgili `js/data/books-*.js` dosyasına yukarıdaki alanlarla yeni bir nesne ekleyin (yazar yoksa `authors.js`'e de ekleyin).
2. Veriyi doğrulayın:

   ```bash
   npm run validate
   ```

   Betik; yinelenen id'leri, eksik alanları, bilinmeyen seviye/dönem/kategori/motifleri, kırık `next` ve okuma yolu bağlantılarını denetler.

## Tarihler ve içerik hakkında

Antik eserlerin çoğunun yazılış tarihi kesin değildir. Tarihler klasik filolojide yaygın kabul gören aralıklara göre verilmiş, tartışmalı durumlar her eserin `dateNote` alanında açıkça belirtilmiştir. Özetler, önem değerlendirmeleri, seviyeler ve puanlar editoryal niteliktedir.

## Lisanslar

- Fontlar (Cormorant Garamond, Inter, Source Serif 4, EB Garamond) SIL Open Font License 1.1 ile dağıtılır; lisans metinleri `assets/fonts/licenses/` klasöründedir.
- Harita kıyı çizgileri Natural Earth verisinden (kamu malı) üretilmiştir.
- Mermer dokuları ve bütün SVG çizimler bu proje için üretilmiştir.
