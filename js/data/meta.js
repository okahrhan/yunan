/* Seviyeler, dönemler, kategoriler ve puanlama sistemi.
   Bu dosya kitap verisinden bağımsızdır; kitaplar buradaki id'lere başvurur. */
window.KLASIK = window.KLASIK || {};

window.KLASIK.levels = [
  {
    id: "baslangic",
    name: "Başlangıç",
    short: "Başlangıç",
    numeral: "I",
    greek: "Α",
    color: "#5b6f45",
    tagline: "Temelleri at",
    desc: "Antik Yunan klasiklerine yeni başlayanlar için. Anlatısı güçlü, dili ve fikir yapısı görece erişilebilir eserler.",
    long: "Bu seviyedeki eserler, sonraki bütün okumaların üzerine kurulduğu ortak zemini oluşturur: Homeros destanları, temel mitoloji, en çok okunan tragedyalar ve Sokrates'in son günleri. Özel bir ön bilgi gerektirmezler; iyi bir açıklamalı çeviri ile rahatça okunabilirler."
  },
  {
    id: "orta",
    name: "Orta Seviye",
    short: "Orta",
    numeral: "II",
    greek: "Β",
    color: "#9a6a35",
    tagline: "Derinleş",
    desc: "Başlangıç eserlerinden sonra önerilen, daha yoğun edebî veya felsefi içerik taşıyan eserler.",
    long: "Tragedya üçlemeleri, uzun tarih anlatıları, Platon'un orta dönem diyalogları ve Aristoteles'in görece erişilebilir eserleri bu seviyededir. Temel mitolojiyi ve Sokrates figürünü tanıyor olmanız okumayı çok kolaylaştırır."
  },
  {
    id: "ileri",
    name: "İleri Seviye",
    short: "İleri",
    numeral: "III",
    greek: "Γ",
    color: "#2b4574",
    tagline: "Kavra",
    desc: "Karmaşık felsefi metinler, ağır tragedyalar ve Antik Yunan düşüncesini daha derin kavramayı gerektiren eserler.",
    long: "Platon'un Devlet'i, Thukydides'in yoğun siyasal analizi, Aristoteles'in Politika ve Retorik'i gibi eserler burada. Yavaş, not alarak ve gerekirse ikinci kez okunmaya değer metinlerdir."
  },
  {
    id: "uzman",
    name: "Uzman / Derinleşme",
    short: "Uzman",
    numeral: "IV",
    greek: "Δ",
    color: "#6b2a2a",
    tagline: "Uzmanlaş",
    desc: "Alanı ciddi biçimde incelemek isteyenler için teknik, zor veya akademik değeri yüksek eserler.",
    long: "Metafizik, Timaios, Enneadlar, Eukleides'in Elemanlar'ı ve Helenistik tarih yazımı gibi metinler; kavramsal hazırlık, çoğu zaman ikincil literatür ve sabır ister. Karşılığında Batı düşüncesinin en derin katmanlarına erişim sağlar."
  }
];

window.KLASIK.periods = [
  {
    id: "arkaik",
    name: "Arkaik Dönem",
    range: "MÖ yaklaşık 800 – 480",
    from: -800,
    to: -480,
    desc: "Alfabenin yayılması, polis (şehir devleti) düzeninin doğuşu ve koloniler çağı. Homeros ve Hesiodos'un şiiri, lirik şairler ve İonia'da ilk filozoflar bu dönemin ürünüdür."
  },
  {
    id: "klasik",
    name: "Klasik Dönem",
    range: "MÖ 480 – 323",
    from: -480,
    to: -323,
    desc: "Pers Savaşları'ndan Büyük İskender'in ölümüne. Atina demokrasisi, tragedya ve komedya, tarih yazımının doğuşu; Sokrates, Platon ve Aristoteles."
  },
  {
    id: "helenistik",
    name: "Helenistik Dönem",
    range: "MÖ 323 – 31",
    from: -323,
    to: -31,
    desc: "İskender'in ölümünden Aktion Savaşı'na. İskenderiye Kütüphanesi, bilimde büyük atılımlar, Epikurosçuluk ve Stoacılık gibi yeni felsefe okulları."
  },
  {
    id: "roma",
    name: "Roma Dönemi",
    range: "MÖ 31 – MS 4. yüzyıl",
    from: -31,
    to: 330,
    desc: "Roma egemenliği altında Yunanca yazmaya devam eden dünya: Plutarkhos, Epiktetos, Lukianos, Marcus Aurelius ve Plotinos."
  }
];

/* group: "edebiyat" olan kategoriler filtrede "Edebiyat (tümü)" seçeneğiyle birlikte eşleşir. */
window.KLASIK.categories = [
  { id: "epik", name: "Epik Edebiyat", group: "edebiyat", motif: "helmet", desc: "Kahramanlık destanları ve uzun anlatı şiirleri; Batı edebiyatının başlangıç noktası." },
  { id: "mitoloji", name: "Mitoloji", group: "mitoloji", motif: "amphora", desc: "Tanrıların, kahramanların ve evrenin doğuşunu anlatan mitler ile mit derlemeleri." },
  { id: "lirik", name: "Lirik Şiir", group: "edebiyat", motif: "lyre", desc: "Lir eşliğinde söylenen kişisel, törensel ve koro şiirleri." },
  { id: "tragedya", name: "Tragedya", group: "edebiyat", motif: "mask-tragic", desc: "Atina tiyatrosunun ciddi türü: kader, sorumluluk, adalet ve acı üzerine sahne eserleri." },
  { id: "komedya", name: "Komedya", group: "edebiyat", motif: "mask-comic", desc: "Siyaseti, düşünürleri ve gündelik hayatı hicveden sahne eserleri." },
  { id: "tarih", name: "Tarih", group: "tarih", motif: "temple", desc: "Olayları sorgulayarak anlatan ve nedenlerini araştıran ilk tarih yazıcıları." },
  { id: "felsefe", name: "Felsefe", group: "felsefe", motif: "owl", desc: "Varlık, bilgi, erdem, siyaset ve mutluluk üzerine sistemli düşünce." },
  { id: "retorik", name: "Retorik", group: "retorik", motif: "scroll", desc: "İkna sanatı, söylev ve üslup üzerine metinler ile büyük hitabet örnekleri." },
  { id: "bilim", name: "Bilim ve Tıp", group: "bilim", motif: "geometry", desc: "Geometri, tıp ve doğa araştırmasının kurucu metinleri." },
  { id: "anlati", name: "Anlatı ve Roman", group: "edebiyat", motif: "syrinx", desc: "Fabl, antik roman ve düzyazı kurmaca: hikâye anlatıcılığının farklı yüzleri." },
  { id: "biyografi", name: "Biyografi", group: "tarih", motif: "laurel", desc: "Büyük insanların ve filozofların hayatlarını anlatan eserler." }
];

/* Kapak renkleri eserin ilk (birincil) kategorisine göre belirlenir. */
window.KLASIK.coverPalette = {
  epik: { bg: "#1b2a4a", ink: "#d8b872", text: "#f3ead6" },
  mitoloji: { bg: "#1f3a35", ink: "#d4b26a", text: "#efe7d4" },
  lirik: { bg: "#46283a", ink: "#dcb77a", text: "#f4e9df" },
  tragedya: { bg: "#17171a", ink: "#b98a52", text: "#eee4d2" },
  komedya: { bg: "#7e4630", ink: "#f1dfbf", text: "#fbf1e1" },
  tarih: { bg: "#3a3224", ink: "#d8b872", text: "#f1e7d1" },
  felsefe: { bg: "#ece5d6", ink: "#1c2d52", text: "#17223d" },
  retorik: { bg: "#2c323c", ink: "#cfae6c", text: "#ede6d8" },
  bilim: { bg: "#213447", ink: "#c9d4df", text: "#eef2f5" },
  anlati: { bg: "#4f5b44", ink: "#efe0bd", text: "#f6efdf" },
  biyografi: { bg: "#562a27", ink: "#e0bf80", text: "#f5e9da" }
};

/* Yıldız puanı: üç ölçütün ortalamasının yuvarlanmasıyla hesaplanır (bkz. app.js → starsOf). */
window.KLASIK.rating = {
  criteria: [
    { id: "tarih", name: "Tarihsel Önem", desc: "Eserin kendi çağında ve Antik Yunan kültür tarihindeki yeri; bir türü başlatıp başlatmadığı, dönemini ne ölçüde temsil ettiği." },
    { id: "edebi", name: "Edebî / Düşünsel Değer", desc: "Metnin sanatsal gücü, fikirlerinin derinliği ve özgünlüğü; bugün okunduğunda hâlâ sunduğu zenginlik." },
    { id: "etki", name: "Sonraki Kültüre Etkisi", desc: "Roma'dan Rönesans'a, modern edebiyat ve felsefeye kadar sonraki düşünce ve sanat üzerindeki izi." }
  ],
  badges: {
    5: { label: "Kesinlikle Oku", short: "Temel Taş", desc: "Antik Yunan klasiklerinin temel taşları. Bu eserler olmadan sonraki geleneği anlamak zordur." },
    4: { label: "Önemli", short: "Önemli", desc: "Alanında belirleyici eserler; okuma yolculuğunu önemli ölçüde zenginleştirir." },
    3: { label: "Tavsiye Edilir", short: "Tavsiye", desc: "Belirli bir türü, dönemi veya düşünceyi derinlemesine tanımak isteyenlere önerilir." },
    2: { label: "Meraklısına", short: "Meraklısına", desc: "Özel ilgi alanları olan okurlar için değerli tamamlayıcı eserler." },
    1: { label: "Meraklısına", short: "Meraklısına", desc: "Özel ilgi alanları olan okurlar için değerli tamamlayıcı eserler." }
  }
};
