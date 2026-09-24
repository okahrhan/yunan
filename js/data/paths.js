/* Önerilen okuma yolları. Sıralama yalnızca popülerliğe göre değil; tarihsel gelişim ve
   her eserin bir sonrakini anlamaya katkısı gözetilerek hazırlanmıştır.
   Her adımdaki "note", o eserin yolun o noktasında neden yer aldığını açıklar. */
window.KLASIK = window.KLASIK || {};

window.KLASIK.paths = [
  {
    id: "yeni-baslayanlar",
    name: "Antik Yunan'a Yeni Başlayanlar İçin",
    short: "Yeni Başlayanlar",
    motif: "column",
    featured: true,
    desc: "Destandan tragedyaya, tarihten felsefeye: Antik Yunan düşüncesinin nasıl geliştiğini adım adım izleyen, her eserin bir sonrakine zemin hazırladığı temel yol.",
    steps: [
      { id: "ilyada", note: "Her şey buradan başlar. Sonraki bütün yazarlar Homeros'la büyüdü; kahramanlık, onur ve kader kavramlarını ilk kez burada görürsün." },
      { id: "odysseia", note: "İlyada'nın dünyasını savaş sonrasına taşır. Agamemnon'un eve dönüşüne yapılan göndermeler, birazdan okuyacağın Oresteia'ya zemin hazırlar." },
      { id: "theogonia", note: "Tragedyaların ve filozofların bildiğini varsaydığı tanrı soy ağacını ve Prometheus mitini öğrenirsin. Kısa ve hızlı okunur." },
      { id: "oresteia", note: "Odysseia'da duyduğun Agamemnon hikâyesi tragedyaya dönüşür; Aiskhylos mitten adalet düşüncesine geçer. Oyun oyun, Agamemnon'la başla." },
      { id: "antigone", note: "Tragedyanın en ünlü çatışması: vicdan ile devlet. Sophokles'in dengeli dramaturjisini tanırsın." },
      { id: "kral-oidipus", note: "Aristoteles'in örnek gösterdiği tragedya. Bilgi, kader ve sorumluluk üzerine düşünmeye başlarsın." },
      { id: "medeia", note: "Euripides ile tragedya psikolojiye ve toplum eleştirisine yönelir; üç büyük tragedya yazarını tanımış olursun." },
      { id: "herodotos", note: "Mitten tarihe geçiş. Tragedyaların sahnelendiği Atina'nın Pers Savaşları'ndan nasıl güçlü çıktığını öğrenirsin (seçme okuma: 1. ve 7.–9. kitaplar)." },
      { id: "bulutlar", note: "Sokrates'le ilk karşılaşma — bir komedyada, karikatür olarak. Onu mahkemeye götüren önyargıları görürsün." },
      { id: "sokrates-savunmasi", note: "Gerçek Sokrates'e geçiş: Bulutlar'daki suçlamaların cevabı ve felsefenin bir yaşam biçimi olarak manifestosu." },
      { id: "solen", note: "Platon'un edebî ustalığının ve İdealar kuramının en erişilebilir hali; Aristophanes de burada bir konuşmacı olarak karşına çıkar." },
      { id: "nikomakhos-etik", note: "Platon'un öğrencisiyle sistemli felsefeye adım atarsın: Homeros'tan beri okuduğun 'iyi insan nedir?' sorusunun olgun cevabı." }
    ]
  },
  {
    id: "tragedya",
    name: "Tragedya Yolu",
    short: "Tragedya",
    motif: "mask-tragic",
    desc: "Aiskhylos'un törensel korolarından Euripides'in psikolojik dramlarına ve Aristoteles'in kuramına: Atina tiyatrosunun doğuşu, olgunluğu ve yorumu.",
    steps: [
      { id: "persler", note: "Günümüze ulaşan en eski tragedya. Tragedyanın erken biçimini ve korunun ağırlığını görürsün." },
      { id: "oresteia", note: "Tek tam üçleme. Aiskhylos'un olgunluk dönemi ve tragedyanın büyük soruları: adalet, suç ve kuşaklar." },
      { id: "prometheus", note: "Mitin tragedyada nasıl yeniden yorumlandığını görmek için kısa ve güçlü bir örnek." },
      { id: "antigone", note: "Sophokles'e geçiş: iki haklı ilke arasındaki trajik çatışma." },
      { id: "medeia", note: "Euripides'in ilk başyapıtlarından; karakterin iç dünyası sahnenin merkezine yerleşir." },
      { id: "kral-oidipus", note: "Olay örgüsü açısından tragedyanın zirvesi; Poetika'nın başlıca örneği." },
      { id: "troyali-kadinlar", note: "Savaş yıllarında Euripides: kahramanlık anlatısının göstermediği acılar." },
      { id: "bakkhalar", note: "Tragedyanın kökenindeki Dionysos'a dönüş; türün en karanlık ve en çok yorumlanan eseri." },
      { id: "kolonos-oidipus", note: "Sophokles'in vedası; Thebai hikâyesinin tamamlanışı." },
      { id: "kurbaglar", note: "Tragedya dönemi kapanırken Aristophanes, Aiskhylos ile Euripides'i yarıştırır: türün çağdaş bir eleştirisi." },
      { id: "poetika", note: "Okuduğun her şeyi Aristoteles'in kuramıyla yeniden düşün: mimesis, katharsis, peripeteia." }
    ]
  },
  {
    id: "felsefe",
    name: "Felsefe Yolu: Thales'ten Plotinos'a",
    short: "Felsefe",
    motif: "owl",
    desc: "İlk filozofların doğa sorularından Sokrates'in etik sorgulamasına, Platon ve Aristoteles'in sistemlerine, Helenistik yaşam felsefelerine ve Yeni Platonculuğa.",
    steps: [
      { id: "sokrates-oncesi", note: "Felsefenin doğuşu: Varlık, değişim ve ilk ilke soruları. Platon ile Aristoteles'in cevap verdiği sorular burada sorulur." },
      { id: "euthyphron", note: "Sokrates'in yöntemi en saf haliyle: Bir kavramı tanımlamaya çalışmak." },
      { id: "sokrates-savunmasi", note: "Felsefenin bir yaşam biçimi olarak savunusu." },
      { id: "kriton", note: "Sokratik etiğin çekirdeği: yasa, adalet ve tutarlılık." },
      { id: "phaidon", note: "İdealar kuramı ve ruhun ölümsüzlüğü; Sokrates'ten Platon'a geçiş." },
      { id: "menon", note: "Bilgi nedir, nasıl öğreniriz? Epistemolojinin başlangıcı." },
      { id: "gorgias", note: "Retorik, güç ve adalet; Devlet'e giden yolun hazırlığı." },
      { id: "solen", note: "Aşk ve güzellik üzerinden İdealar'a yükseliş." },
      { id: "devlet", note: "Platon'un başyapıtı: adalet, eğitim, bilgi ve ideal devlet." },
      { id: "nikomakhos-etik", note: "Aristoteles'in cevabı: İdealar yerine karakter, alışkanlık ve pratik bilgelik." },
      { id: "politika", note: "Etikten siyasete: Devlet'e Aristotelesçi bir karşılık." },
      { id: "metafizik", note: "Varlık olarak varlık: antik felsefenin en derin sorusu." },
      { id: "epikuros", note: "Helenistik çağ: Felsefe huzurlu bir hayatın sanatına dönüşür." },
      { id: "enkheiridion", note: "Stoacılığın pratik özü; Epikuros ile karşılaştırarak oku." },
      { id: "plotinos", note: "Antik felsefenin son büyük sistemi; Platon'un Orta Çağ'a aktarılan yüzü." }
    ]
  },
  {
    id: "tarih",
    name: "Tarih Yolu: Troya'dan Roma'ya",
    short: "Tarih",
    motif: "temple",
    desc: "Mit ile tarih arasındaki sınırın nasıl çizildiğini ve tarih yazımının Herodotos'tan Plutarkhos'a nasıl geliştiğini izleyen yol.",
    steps: [
      { id: "ilyada", note: "Yunanların kendi 'tarihlerinin' başlangıcı saydığı savaş; mit ile tarihin iç içe olduğu nokta." },
      { id: "persler", note: "Yakın tarihin sahneye taşınması: Salamis'e bir çağdaşın bakışı." },
      { id: "herodotos", note: "Araştırma olarak tarih: kaynakları karşılaştıran, dünyayı dolaşan ilk tarihçi." },
      { id: "thukydides", note: "Eleştirel ve siyasal tarih: nedensellik, güç ve insan doğası." },
      { id: "anabasis", note: "Bir katılımcının kaleminden askeri anı; Anadolu'nun içinden bir yolculuk." },
      { id: "demosthenes", note: "Klasik dönemin sonu: Makedonya karşısında Atina'nın sesi." },
      { id: "polybios", note: "Helenistik tarih yazımı ve Roma'nın yükselişi; evrensel tarih fikri." },
      { id: "plutarkhos", note: "Tarihten biyografiye: Yunan ve Roma'nın büyük insanları karşılaştırmalı olarak." }
    ]
  },
  {
    id: "mitoloji",
    name: "Mitoloji Yolu",
    short: "Mitoloji",
    motif: "amphora",
    desc: "Tanrıların doğuşundan kahramanlar çağına, mitlerin tragedyada yeniden yorumlanmasına ve sonunda alaycı bir bakışla sorgulanmasına.",
    steps: [
      { id: "theogonia", note: "Evrenin ve tanrıların doğuşu: bütün mitolojinin soy ağacı." },
      { id: "homerik-ilahiler", note: "Tek tek tanrıların hikâyeleri: Demeter, Hermes, Apollon, Aphrodite." },
      { id: "ilyada", note: "Tanrılar ve kahramanlar aynı sahnede: Troya Savaşı." },
      { id: "odysseia", note: "Canavarlar, büyücüler ve ölüler diyarı: mitolojik coğrafyanın haritası." },
      { id: "apollodoros", note: "Bütün mitleri bir arada gösteren antik el kitabı; boşlukları doldurur." },
      { id: "bakkhalar", note: "Bir tanrının gücü sahnede: mitin tragedyadaki en ürkütücü yüzü." },
      { id: "argonautika", note: "Kahramanlık mitinin Helenistik yeniden yazımı." },
      { id: "lukianos", note: "Mitlere gülmek: tanrıların dedikodusu ve ironik bir bakış." }
    ]
  },
  {
    id: "yasam-felsefesi",
    name: "Nasıl Yaşamalı? Pratik Felsefe Yolu",
    short: "Yaşam Felsefesi",
    motif: "lamp",
    desc: "Felsefeyi bir yaşam sanatı olarak okumak isteyenler için: Sokrates'in örneğinden Aristoteles'in erdem etiğine, Epikuros'un huzuruna ve Stoacıların iç özgürlüğüne.",
    steps: [
      { id: "sokrates-savunmasi", note: "Sorgulanmış bir hayat: felsefenin kişisel sorumluluk olarak başlangıcı." },
      { id: "kriton", note: "İlkelerine sadık kalmak: haksızlığa haksızlıkla karşılık vermemek." },
      { id: "gorgias", note: "Güç ve haz mı, ölçü ve adalet mi? İyi hayat üzerine sert bir tartışma." },
      { id: "nikomakhos-etik", note: "Mutluluk, erdem ve dostluk: iyi yaşamın en kapsamlı haritası." },
      { id: "epikuros", note: "Korkusuz ve sade bir hayat: hazzın doğru anlaşılması." },
      { id: "enkheiridion", note: "Elimizde olan ile olmayan: Stoacı özgürlüğün temel ayrımı." },
      { id: "marcus-aurelius", note: "Bu ilkeleri yaşamaya çalışan bir imparatorun iç sesi." }
    ]
  },
  {
    id: "edebiyat",
    name: "Şiirden Romana: Edebiyat Yolu",
    short: "Edebiyat",
    motif: "lyre",
    desc: "Epik, lirik, dram ve roman: Yunan edebiyatının türlerini doğdukları sırayla izleyen, edebiyat severler için bir yol.",
    steps: [
      { id: "odysseia", note: "Anlatı sanatının başlangıcı: çerçeve anlatı ve geriye dönüş." },
      { id: "lirik-siir", note: "Kişisel sesin doğuşu: Sappho ve lirik şairler." },
      { id: "antigone", note: "Dramın doğuşu: karakterler aracılığıyla düşünmek." },
      { id: "kurbaglar", note: "Edebiyat eleştirisinin sahneye çıkışı." },
      { id: "menandros", note: "Gündelik hayatın komedyası: modern sitcom'un atası." },
      { id: "theokritos", note: "Helenistik incelik ve pastoral şiirin doğuşu." },
      { id: "argonautika", note: "Destanın yeniden yazımı: modern bir kahraman ve aşkın psikolojisi." },
      { id: "longos", note: "Antik roman: düzyazıda pastoral bir aşk hikâyesi." },
      { id: "lukianos", note: "Fantastik ve hiciv: bilimkurgunun antik atası." },
      { id: "yuce-uzerine", note: "Bütün bu okumaların ardından: büyük edebiyat okuru nasıl sarsar?" }
    ]
  }
];

/* Zaman çizelgesinde bağlam için gösterilen tarihsel olaylar */
window.KLASIK.events = [
  { year: -776, label: "Geleneğe göre ilk Olimpiyat Oyunları" },
  { year: -750, label: "Yunan alfabesinin yayılması ve koloni hareketi (yaklaşık)" },
  { year: -594, label: "Solon'un Atina'daki reformları" },
  { year: -585, label: "Thales'in öngördüğü söylenen güneş tutulması" },
  { year: -508, label: "Kleisthenes'in reformları: Atina demokrasisinin temelleri" },
  { year: -490, label: "Marathon Savaşı" },
  { year: -480, label: "Thermopylai ve Salamis savaşları" },
  { year: -447, label: "Parthenon'un inşasına başlanır" },
  { year: -431, label: "Peloponnesos Savaşı başlar (MÖ 431–404)" },
  { year: -399, label: "Sokrates'in yargılanması ve idamı" },
  { year: -387, label: "Platon Akademia'yı kurar (yaklaşık)" },
  { year: -338, label: "Khaironeia Savaşı: Makedonya'nın hâkimiyeti" },
  { year: -335, label: "Aristoteles Lykeion'u kurar" },
  { year: -323, label: "Büyük İskender'in ölümü; Helenistik dönem başlar" },
  { year: -290, label: "İskenderiye Kütüphanesi'nin kuruluşu (yaklaşık)" },
  { year: -146, label: "Roma, Kartaca'yı ve Korinthos'u yıkar" },
  { year: -31, label: "Aktion Savaşı; Roma dönemi başlar" },
  { year: 161, label: "Marcus Aurelius imparator olur" },
  { year: 244, label: "Plotinos Roma'da ders vermeye başlar" }
];
