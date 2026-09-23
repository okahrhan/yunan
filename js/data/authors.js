/* Yazarlar. places: haritadaki yer id'leri (ilki doğum yeri ya da ana merkez).
   anatolia: Anadolu ile bağlantısı varsa kısa not. */
window.KLASIK = window.KLASIK || {};

window.KLASIK.authors = {
  homeros: {
    alt: ["Homer", "Omiros"],
    name: "Homeros",
    greek: "Ὅμηρος",
    life: "MÖ 8. yüzyıl (?) — tarihsel kimliği tartışmalı",
    origin: "Geleneğe göre İonia (İzmir ya da Sakız Adası)",
    places: ["smyrna", "khios"],
    bio: "Antik gelenekte İlyada ile Odysseia'nın şairi sayılan kör ozan. Gerçekten tek bir şair mi, yoksa yüzyıllar süren bir sözlü geleneğin ortak adı mı olduğu, 'Homeros sorunu' diye bilinen tartışmanın konusudur.",
    anatolia: "Antik kaynaklarda doğum yeri olarak en sık İzmir (Smyrna) ve Sakız (Khios) gösterilir; destanların dili de ağırlıkla İonya lehçesidir."
  },
  hesiodos: {
    alt: ["Hesiod", "Hesiodus"],
    name: "Hesiodos",
    greek: "Ἡσίοδος",
    life: "MÖ yaklaşık 700 civarında etkin",
    origin: "Askra, Boiotia",
    places: ["askra", "kyme"],
    bio: "Boiotia'da çiftçilik yapan ve Musalar tarafından şairliğe çağrıldığını anlatan ozan. Kendi adını ve hayatını eserlerinde anlatan ilk Yunan şairidir.",
    anatolia: "İşler ve Günler'e göre babası, Aiolis'teki Kyme'den (bugünkü Aliağa yakınları) Boiotia'ya göç etmiştir."
  },
  "anonim-homerik": {
    alt: ["Homeros", "Homer"],
    name: "Anonim (Homerik gelenek)",
    greek: "Ὁμηρικοὶ Ὕμνοι",
    life: "MÖ 7. yüzyıldan itibaren",
    origin: "Çeşitli Yunan bölgeleri",
    places: [],
    bio: "Homerik İlahiler antik çağda Homeros'a atfedilmiştir; bugün farklı yüzyıllarda yaşamış, adları bilinmeyen şairlerin eserleri olduğu kabul edilir."
  },
  "lirik-sairler": {
    alt: ["Sappho", "Safo", "Alkaios", "Arkhilokhos", "Anakreon"],
    name: "Sappho ve lirik şairler",
    greek: "Σαπφώ",
    life: "Sappho: MÖ yaklaşık 630 – 570",
    origin: "Lesbos (Midilli)",
    places: ["mytilene"],
    bio: "Antik çağda 'onuncu Musa' diye anılan Sappho; Alkaios, Arkhilokhos ve Anakreon gibi şairlerle birlikte Arkaik lirik şiirin en güçlü sesidir.",
    anatolia: "Sappho ile Alkaios'un adası Lesbos (Midilli), Ayvalık kıyılarının hemen karşısındadır."
  },
  aisopos: {
    alt: ["Ezop", "Aesop", "Esop"],
    name: "Aisopos (Ezop)",
    greek: "Αἴσωπος",
    life: "MÖ 6. yüzyıl (geleneğe göre)",
    origin: "Geleneğe göre Phrygia; Samos'ta köle olarak yaşadığı anlatılır",
    places: ["samos"],
    bio: "Herodotos'un da andığı, Samos'ta köle olarak yaşamış masal anlatıcısı. Hayatına dair anlatıların büyük kısmı efsanedir.",
    anatolia: "Antik biyografik gelenek onu Phrygia'lı, yani İç Batı Anadolu'dan biri olarak tanıtır."
  },
  "sokrates-oncesi": {
    alt: ["Thales", "Herakleitos", "Heraklitos", "Parmenides", "Anaksimandros", "Empedokles", "Demokritos", "Pythagoras", "Pisagor"],
    name: "Sokrates öncesi filozoflar",
    greek: "Θαλῆς · Ἡράκλειτος · Παρμενίδης",
    life: "MÖ yaklaşık 585 – 400",
    origin: "İonia, Güney İtalya ve Sicilya",
    places: ["miletos", "ephesos", "samos", "elea"],
    bio: "Thales, Anaksimandros, Anaksimenes, Pythagoras, Herakleitos, Parmenides, Empedokles, Anaksagoras ve Demokritos gibi, evreni mitlerden bağımsız olarak açıklamaya çalışan ilk düşünürler.",
    anatolia: "Felsefe Miletos'ta (bugünkü Balat, Didim) doğdu: Thales, Anaksimandros ve Anaksimenes Miletoslu, Herakleitos Efesliydi."
  },
  pindaros: {
    alt: ["Pindar", "Pindarus"],
    name: "Pindaros",
    greek: "Πίνδαρος",
    life: "MÖ yaklaşık 518 – 438 sonrası",
    origin: "Kynoskephalai, Thebai yakınları (Boiotia)",
    places: ["thebai"],
    bio: "Olympia, Delphoi, Isthmos ve Nemea oyunlarının galipleri için zafer kasideleri yazan koro şairi. Antik çağda dokuz büyük lirik şairin en büyüğü sayıldı."
  },
  aiskhylos: {
    alt: ["Aeschylus", "Aiskylos", "Eshilos", "Esilos"],
    name: "Aiskhylos",
    greek: "Αἰσχύλος",
    life: "MÖ yaklaşık 525/524 – 456/455",
    origin: "Eleusis (Attika)",
    places: ["eleusis", "atina"],
    bio: "Tragedyanın 'babası' sayılan oyun yazarı. Aristoteles'e göre sahneye ikinci oyuncuyu ekleyerek gerçek dramatik diyaloğu mümkün kıldı. Marathon'da Perslere karşı savaştı; Sicilya'daki Gela'da öldü."
  },
  sophokles: {
    alt: ["Sofokles", "Sophocles"],
    name: "Sophokles",
    greek: "Σοφοκλῆς",
    life: "MÖ yaklaşık 497/496 – 406/405",
    origin: "Kolonos (Atina)",
    places: ["atina"],
    bio: "Atina tiyatrosunun en başarılı yazarlarından. Yüz yirmiyi aşkın oyun yazdığı, bunlardan yalnızca yedisinin tam olarak günümüze ulaştığı bilinir. Sahneye üçüncü oyuncuyu ekledi ve komutan (strategos) olarak da görev yaptı."
  },
  euripides: {
    alt: ["Euripid", "Evripidis"],
    name: "Euripides",
    greek: "Εὐριπίδης",
    life: "MÖ yaklaşık 480 – 406",
    origin: "Atina (geleneğe göre Salamis'te doğdu)",
    places: ["atina"],
    bio: "Mitleri sorgulayan, kadın karakterlere ve insan psikolojisine odaklanan tragedya yazarı. Ondan günümüze diğer iki büyük tragedya yazarının toplamından daha çok oyun ulaşmıştır. Son yıllarını Makedonya sarayında geçirdi."
  },
  aristophanes: {
    alt: ["Aristofanes", "Aristophanes"],
    name: "Aristophanes",
    greek: "Ἀριστοφάνης",
    life: "MÖ yaklaşık 446 – 386",
    origin: "Atina",
    places: ["atina"],
    bio: "Eski Komedya'nın oyunları tam olarak günümüze ulaşan tek temsilcisi. Politikacıları, şairleri ve filozofları sahnede acımasızca hicvetti; on bir oyunu elimizdedir."
  },
  herodotos: {
    alt: ["Herodot", "Herodotus"],
    name: "Herodotos",
    greek: "Ἡρόδοτος",
    life: "MÖ yaklaşık 484 – 425",
    origin: "Halikarnassos (Bodrum)",
    places: ["halikarnassos"],
    bio: "Cicero'nun 'tarihin babası' dediği yazar. Mısır'dan Karadeniz'in kuzeyine kadar geniş bir coğrafyayı dolaşarak Pers Savaşları'nın nedenlerini araştırdı.",
    anatolia: "Bugünkü Bodrum'da (Halikarnassos) doğdu; eserinde Lidya, İonia ve Karia gibi Anadolu bölgelerine geniş yer verir."
  },
  thukydides: {
    alt: ["Tukidides", "Thucydides", "Tukididis"],
    name: "Thukydides",
    greek: "Θουκυδίδης",
    life: "MÖ yaklaşık 460 – 400",
    origin: "Atina",
    places: ["atina"],
    bio: "Peloponnesos Savaşı'nda Atinalı bir komutandı; MÖ 424'te Amphipolis'i kurtaramadığı için sürgüne gönderildi ve bu yıllarda savaşın tarihini yazdı. Atina vebasına kendisi de yakalanıp iyileşmişti."
  },
  gorgias: {
    alt: ["Gorgias"],
    name: "Gorgias",
    greek: "Γοργίας",
    life: "MÖ yaklaşık 483 – 375",
    origin: "Leontinoi (Sicilya)",
    places: ["leontinoi"],
    bio: "Sofistlerin en ünlülerinden. MÖ 427'de elçi olarak geldiği Atina'yı söz sanatıyla büyüledi; yüz yılı aşkın yaşadığı rivayet edilir. Platon adını taşıyan bir diyalog yazmıştır."
  },
  hippokrates: {
    alt: ["Hipokrat", "Hippocrates", "Hipokrates"],
    name: "Hippokrates ve okulu",
    greek: "Ἱπποκράτης",
    life: "MÖ yaklaşık 460 – 370",
    origin: "Kos (İstanköy)",
    places: ["kos"],
    bio: "Tıbbı din ve büyüden ayırıp gözleme dayandıran hekim. Adını taşıyan yaklaşık altmış eserlik külliyat, onun ve farklı kuşaklardan hekimlerin yazılarından oluşur.",
    anatolia: "Kos, Bodrum'un tam karşısındaki İstanköy adasıdır."
  },
  platon: {
    alt: ["Eflatun", "Plato", "Aflatun"],
    name: "Platon",
    greek: "Πλάτων",
    life: "MÖ 428/427 – 348/347",
    origin: "Atina",
    places: ["atina"],
    bio: "Sokrates'in öğrencisi, Aristoteles'in hocası. MÖ yaklaşık 387'de Akademia'yı kurdu. Eserlerini, çoğunda Sokrates'in konuştuğu diyaloglar biçiminde yazdı; bilinen eserlerinin tamamının günümüze ulaştığı düşünülen tek antik filozoftur."
  },
  ksenophon: {
    alt: ["Xenophon", "Ksenofon"],
    name: "Ksenophon",
    greek: "Ξενοφῶν",
    life: "MÖ yaklaşık 430 – 354",
    origin: "Atina (Erkhia demi)",
    places: ["atina"],
    bio: "Sokrates'in öğrencisi, asker ve yazar. Pers prensi Kyros'un paralı askerleriyle Anadolu'ya gitti; Sparta'ya yakınlığı nedeniyle Atina'dan sürgün edildi ve uzun yıllar Peloponnesos'ta yaşadı.",
    anatolia: "Anabasis, Onbinler'in Sart'tan (Sardeis) Mezopotamya'ya, oradan Doğu Anadolu dağlarını aşarak Trabzon'a (Trapezus) uzanan yolculuğunu anlatır."
  },
  demosthenes: {
    alt: ["Demosten", "Demostenes"],
    name: "Demosthenes",
    greek: "Δημοσθένης",
    life: "MÖ 384 – 322",
    origin: "Atina",
    places: ["atina"],
    bio: "Antik çağın en büyük hatibi sayılır. Makedonyalı II. Philippos'a karşı Atinalıları uyarmak için verdiği söylevler, 'filipika' sözcüğüne adını verdi."
  },
  aristoteles: {
    alt: ["Aristo", "Aristotle", "Aristotales"],
    name: "Aristoteles",
    greek: "Ἀριστοτέλης",
    life: "MÖ 384 – 322",
    origin: "Stageira (Khalkidike)",
    places: ["stageira", "assos", "atina"],
    bio: "Platon'un Akademia'sında yaklaşık yirmi yıl kaldı, genç İskender'e hocalık yaptı ve MÖ 335'te Atina'da Lykeion'u kurdu. Mantıktan biyolojiye, etikten poetikaya kadar pek çok disiplini kurdu ya da sistemleştirdi.",
    anatolia: "Platon'un ölümünden sonra yaklaşık MÖ 347–345 yıllarında Assos'ta (Behramkale, Çanakkale) yaşayıp ders verdi."
  },
  theophrastos: {
    alt: ["Theophrastus", "Teofrastos"],
    name: "Theophrastos",
    greek: "Θεόφραστος",
    life: "MÖ yaklaşık 371 – 287",
    origin: "Eresos (Midilli)",
    places: ["eresos", "atina"],
    bio: "Aristoteles'in öğrencisi ve Lykeion'daki halefi; bitkibilimin kurucusu sayılır. 'Theophrastos' (tanrısal konuşan) adını ona hocasının verdiği anlatılır."
  },
  menandros: {
    alt: ["Menander", "Menandros"],
    name: "Menandros",
    greek: "Μένανδρος",
    life: "MÖ yaklaşık 342/341 – 290",
    origin: "Atina",
    places: ["atina"],
    bio: "Yeni Komedya'nın en büyük yazarı. Yüzü aşkın oyun yazdı; eserleri yüzyıllarca yalnızca alıntılardan bilindi, 20. yüzyılda papirüs buluntularıyla yeniden gün yüzüne çıktı."
  },
  epikuros: {
    alt: ["Epikür", "Epicurus", "Epiküros"],
    name: "Epikuros",
    greek: "Ἐπίκουρος",
    life: "MÖ 341 – 270",
    origin: "Samos",
    places: ["samos", "lampsakos", "mytilene", "atina"],
    bio: "MÖ 306 civarında Atina'da 'Bahçe' (Kepos) adlı okulunu kurdu. Amacı insanı ölüm ve tanrı korkusundan kurtararak huzurlu bir hayata (ataraksia) ulaştırmaktı.",
    anatolia: "Atina'ya yerleşmeden önce Kolophon'da (Değirmendere yakınları) yaşadı; Mytilene'de ve Lampsakos'ta (Lapseki) ders verdi."
  },
  eukleides: {
    alt: ["Öklid", "Euclid", "Oklid"],
    name: "Eukleides (Öklid)",
    greek: "Εὐκλείδης",
    life: "MÖ yaklaşık 300 civarında etkin",
    origin: "İskenderiye'de çalıştı",
    places: ["iskenderiye"],
    bio: "Hayatı hakkında neredeyse hiçbir şey bilinmeyen matematikçi. I. Ptolemaios döneminde İskenderiye'de çalıştığı kabul edilir."
  },
  theokritos: {
    alt: ["Theocritus", "Teokritos"],
    name: "Theokritos",
    greek: "Θεόκριτος",
    life: "MÖ yaklaşık 300 – 260",
    origin: "Syrakusai (Sicilya)",
    places: ["syrakusai", "kos", "iskenderiye"],
    bio: "Pastoral (çoban) şiirinin kurucusu. Sicilya'dan Kos'a ve İskenderiye'ye uzanan bir hayat sürdü; II. Ptolemaios'un sarayıyla ilişki içindeydi."
  },
  apollonios: {
    alt: ["Apollonius", "Apollonios Rhodios"],
    name: "Apollonios Rhodios",
    greek: "Ἀπολλώνιος Ῥόδιος",
    life: "MÖ 3. yüzyıl",
    origin: "İskenderiye (sonradan Rodos'a yerleştiği düşünülür)",
    places: ["iskenderiye"],
    bio: "İskenderiye Kütüphanesi'nin yöneticilerinden biri olan şair ve bilgin. 'Rodoslu' lakabını, hayatının bir döneminde Rodos'ta yaşamasından aldığı düşünülür."
  },
  polybios: {
    alt: ["Polybius", "Polibios"],
    name: "Polybios",
    greek: "Πολύβιος",
    life: "MÖ yaklaşık 200 – 118",
    origin: "Megalopolis (Arkadia)",
    places: ["megalopolis", "roma"],
    bio: "Akha Birliği'nin önde gelen devlet adamlarından biriyken MÖ 167'de Roma'ya rehine olarak götürüldü. Scipio Aemilianus'un dostu oldu ve Kartaca'nın yıkılışına (MÖ 146) tanıklık etti."
  },
  longinos: {
    alt: ["Longinus", "Sahte-Longinos"],
    name: "“Longinos”",
    greek: "Λογγῖνος",
    life: "MS 1. yüzyıl (?) — kimliği bilinmiyor",
    origin: "Bilinmiyor",
    places: [],
    bio: "El yazmalarında 'Dionysios ya da Longinos' adıyla geçen, kimliği bilinmeyen yazar. Bugün çoğu araştırmacı eseri MS 1. yüzyıla tarihlediği için yazara 'Sahte-Longinos' da denir."
  },
  plutarkhos: {
    alt: ["Plutark", "Plutarch", "Plutarkos"],
    name: "Plutarkhos",
    greek: "Πλούταρχος",
    life: "MS yaklaşık 46 – 120 sonrası",
    origin: "Khaironeia (Boiotia)",
    places: ["khaironeia", "delphoi"],
    bio: "Platoncu filozof, biyografi yazarı ve Delphoi'deki Apollon tapınağının rahibi. Yunan ve Roma dünyalarını birbirine tanıtan geniş bir külliyat bıraktı."
  },
  apollodoros: {
    alt: ["Apollodorus", "Sahte-Apollodoros"],
    name: "“Apollodoros”",
    greek: "Ἀπολλόδωρος",
    life: "MS 1.–2. yüzyıl (?)",
    origin: "Bilinmiyor",
    places: [],
    bio: "El yazmalarında MÖ 2. yüzyıldaki Atinalı bilgin Apollodoros'a atfedilen eser, içerdiği daha geç bir kaynağa atıf nedeniyle bugün başka bir yazara verilir; bu yüzden 'Sahte-Apollodoros' olarak anılır."
  },
  epiktetos: {
    alt: ["Epictetus", "Epiktet"],
    name: "Epiktetos",
    greek: "Ἐπίκτητος",
    life: "MS yaklaşık 50 – 135",
    origin: "Hierapolis (Pamukkale, Denizli)",
    places: ["hierapolis", "roma", "nikopolis"],
    bio: "Roma'da köle olarak yaşamış, azat edildikten sonra Stoacı öğretmen olmuş filozof. İmparator Domitianus filozofları Roma'dan sürünce Nikopolis'te okul açtı. Kendisi yazmadı; derslerini öğrencisi Arrianos kaydetti.",
    anatolia: "Phrygia'daki Hierapolis'te, bugünkü Pamukkale'de doğdu."
  },
  lukianos: {
    alt: ["Lucian", "Lucianus", "Samsatlı Lukianos"],
    name: "Lukianos",
    greek: "Λουκιανός",
    life: "MS yaklaşık 125 – 180 sonrası",
    origin: "Samosata (Samsat, Adıyaman)",
    places: ["samosata"],
    bio: "Kendini 'Suriyeli' diye tanımlayan, Yunancayı sonradan öğrenip ustalaşmış hicivci. Keskin mizahıyla filozofları, tanrıları ve batıl inançları alaya aldı.",
    anatolia: "Fırat kıyısındaki Samosata'da, bugünkü Samsat'ta (Adıyaman) doğdu."
  },
  marcus: {
    alt: ["Marcus Aurelius", "Markus Aurelius", "Marcus Aurelius Antoninus"],
    name: "Marcus Aurelius",
    greek: "Μάρκος Αὐρήλιος",
    life: "MS 121 – 180",
    origin: "Roma",
    places: ["roma"],
    bio: "MS 161–180 yılları arasında hüküm süren Roma imparatoru ve Stoacı filozof. Kişisel notlarını Latince değil, felsefenin dili saydığı Yunanca ile yazdı."
  },
  longos: {
    alt: ["Longus"],
    name: "Longos",
    greek: "Λόγγος",
    life: "MS 2.–3. yüzyıl (?)",
    origin: "Muhtemelen Lesbos",
    places: ["mytilene"],
    bio: "Hakkında eserinden başka hiçbir şey bilinmeyen yazar. Romanının Lesbos'ta geçmesi ve adayı iyi tanıması, oralı olabileceğini düşündürür."
  },
  sextus: {
    alt: ["Sextus Empiricus", "Sekstus"],
    name: "Sextus Empiricus",
    greek: "Σέξτος Ἐμπειρικός",
    life: "MS 2.–3. yüzyıl (?)",
    origin: "Bilinmiyor",
    places: [],
    bio: "Hekim ve Pyrrhoncu şüpheci filozof. 'Empiricus' lakabı, gözleme dayalı Empirik tıp okuluna bağlılığından gelir. Eserleri antik şüpheciliğin en kapsamlı kaynağıdır."
  },
  "diogenes-laertios": {
    alt: ["Diogenes Laertius", "Laertios"],
    name: "Diogenes Laertios",
    greek: "Διογένης Λαέρτιος",
    life: "MS 3. yüzyıl (?)",
    origin: "Bilinmiyor",
    places: [],
    bio: "Hayatı hakkında hiçbir şey bilinmeyen derleyici. Yüzlerce kaynaktan yararlanarak yazdığı eser, pek çok filozof hakkında elimizdeki başlıca bilgi kaynağıdır."
  },
  plotinos: {
    alt: ["Plotinus", "Plotin"],
    name: "Plotinos",
    greek: "Πλωτῖνος",
    life: "MS 204/205 – 270",
    origin: "Muhtemelen Lykopolis (Mısır)",
    places: ["iskenderiye", "roma"],
    bio: "İskenderiye'de Ammonios Sakkas'ın öğrencisi oldu, MS 244'ten itibaren Roma'da ders verdi. Yeni Platonculuğun kurucusu sayılır; yazılarını öğrencisi Porphyrios düzenledi."
  }
};

/* Haritadaki önemli yerlerde geçen ya da yerle ilişkili eserler */
window.KLASIK.placeNotes = {
  troia: { note: "Troya Savaşı'nın efsanevi sahnesi.", books: ["ilyada", "troyali-kadinlar"] },
  delphoi: { note: "Apollon'un kehanet merkezi; 'Kendini bil' yazıtı tapınağın girişindeydi.", books: ["kral-oidipus", "sokrates-savunmasi", "plutarkhos"] },
  olympia: { note: "Olimpiyat Oyunları'nın yapıldığı Zeus kutsal alanı.", books: ["pindaros"] },
  sparta: { note: "Atina'nın Peloponnesos Savaşı'ndaki büyük rakibi.", books: ["thukydides", "lysistrate"] },
  knossos: { note: "Minos, Labirent ve Minotauros mitlerinin geçtiği Girit sarayı.", books: ["apollodoros"] },
  korinthos: { note: "Euripides'in Medeia'sının geçtiği şehir.", books: ["medeia"] },
  thebai: { note: "Oidipus ve Antigone'nin şehri; Dionysos'un annesi Semele'nin memleketi.", books: ["kral-oidipus", "antigone", "bakkhalar"] },
  atina: { note: "Klasik dönemde tiyatronun, tarih yazımının ve felsefenin merkezi.", books: ["oresteia", "sokrates-savunmasi", "devlet"] },
  mytilene: { note: "Longos'un romanı Daphnis ile Khloe, Lesbos kırsalında geçer.", books: ["longos"] },
  halikarnassos: { note: "Herodotos'un doğduğu şehir; Mausoleion burada inşa edildi.", books: ["herodotos"] }
};
