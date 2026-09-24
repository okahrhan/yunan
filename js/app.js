/* Antik Yunan Klasikleri — uygulama
   Bağımlılıksız, hash tabanlı tek sayfa uygulaması. Veriler js/data/*.js dosyalarından gelir.
   İçindekiler: yardımcılar → veri hazırlığı → okuma durumu → bileşenler → sayfalar → yönlendirici */
(function () {
  "use strict";

  const K = window.KLASIK;

  /* Uygulama durumu: yönlendirici, arama penceresi ve mobil menü */
  let currentRoute = null;
  let lastHash = location.hash;
  let navByClick = false;
  let searchOpen = false, searchIndex = 0, searchItems = [], searchReturnFocus = null;
  let menuOpen = false;
  const scrollMemory = new Map();

  /* ───────────── Yardımcılar ───────────── */
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const icon = (name, cls = "ico") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const motif = (name, cls = "motif") => `<svg class="${cls}" aria-hidden="true"><use href="#m-${name}"></use></svg>`;
  const pad = (n) => String(n).padStart(2, "0");
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const upperTR = (s) => s.toLocaleUpperCase("tr");
  const scrollBehavior = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  // Türkçe duyarlı, aksan/şapka farkını yok sayan arama normalizasyonu
  const norm = (s) =>
    String(s ?? "")
      .toLocaleLowerCase("tr")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i")
      .replace(/[^a-z0-9\u0370-\u03ff\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const centuryOf = (y) => (y < 0 ? -Math.ceil(-y / 100) : Math.ceil(y / 100));
  const centuryLabel = (c) => (c < 0 ? `MÖ ${-c}. yüzyıl` : `MS ${c}. yüzyıl`);
  const centuryShort = (c) => (c < 0 ? `MÖ ${-c}. yy` : `MS ${c}. yy`);
  const yearLabel = (y) => (y < 0 ? `MÖ ${-y}` : `MS ${y}`);

  /* ───────────── Veri hazırlığı ───────────── */
  const LEVELS = K.levels;
  const LEVEL = Object.fromEntries(LEVELS.map((l) => [l.id, l]));
  const PERIODS = K.periods;
  const PERIOD = Object.fromEntries(PERIODS.map((p) => [p.id, p]));
  const CATS = K.categories;
  const CAT = Object.fromEntries(CATS.map((c) => [c.id, c]));
  const AUTH = K.authors;
  const PATHS = K.paths;
  const PATH = Object.fromEntries(PATHS.map((p) => [p.id, p]));

  const BOOKS = [...K.books].sort((a, b) => a.year - b.year || a.title.localeCompare(b.title, "tr"));
  const BOOK = {};
  BOOKS.forEach((b, i) => {
    b.order = i + 1;
    b.stars = Math.round((b.scores.tarih + b.scores.edebi + b.scores.etki) / 3);
    b.levelIndex = LEVELS.findIndex((l) => l.id === b.level);
    BOOK[b.id] = b;
  });
  const byLevel = (id) => BOOKS.filter((b) => b.level === id);
  LEVELS.forEach((l) => byLevel(l.id).forEach((b, i) => (b.step = i + 1)));

  // Bu eseri "sonraki okuma" olarak öneren eserler
  const PREV = {};
  BOOKS.forEach((b) => b.next.forEach((n) => (PREV[n] = PREV[n] || []).push(b.id)));

  // Yazarları ilk eserlerinin tarihine göre sırala
  const AUTHOR_ORDER = [];
  BOOKS.forEach((b) => { if (!AUTHOR_ORDER.includes(b.author)) AUTHOR_ORDER.push(b.author); });
  const booksOf = (authorId) => BOOKS.filter((b) => b.author === authorId);

  // Tür filtresi için eser türlerini üst gruplara ayır
  const GENRES = [
    ["epik", "Destan ve epik şiir", /^(Epik|Mitolojik şiir|Didaktik|İlahi)/],
    ["lirik", "Lirik ve pastoral şiir", /(Lirik|lirik|Pastoral şiir)/],
    ["tragedya", "Tragedya", /^Tragedya/],
    ["komedya", "Komedya", /^Komedya/],
    ["tarih", "Tarih yazımı", /^Tarih/],
    ["diyalog", "Felsefi diyalog", /^Felsefi diyalog/],
    ["inceleme", "Felsefi inceleme ve metin", /^(Felsefi inceleme|Felsefi metin|Felsefi el kitabı|Felsefi notlar|Felsefi mektup|Felsefi anı|Felsefi fragman)/],
    ["soylev", "Söylev ve eleştiri", /^(Söylev|Edebiyat eleştirisi)/],
    ["biyografi", "Biyografi", /^Biyografi/],
    ["anlati", "Fabl, roman ve hiciv", /^(Fabl|Roman|Hiciv|Karakter)/],
    ["bilimsel", "Bilimsel inceleme", /^(Tıbbi|Matematik)/],
    ["derleme", "Mitoloji derlemesi", /^Mitoloji derlemesi/]
  ];
  BOOKS.forEach((b) => {
    const g = GENRES.find(([, , re]) => re.test(b.genre));
    b.genreKey = g ? g[0] : "diger";
  });
  const GENRE_NAME = Object.fromEntries(GENRES.map(([k, n]) => [k, n]));

  // Arama dizini
  BOOKS.forEach((b) => {
    const a = AUTH[b.author];
    b._title = norm([b.title, b.subtitle].join(" "));
    b._author = norm([a.name, ...(a.alt || [])].join(" "));
    b._all = norm([b.title, b.subtitle, b.original, ...(b.alt || []), a.name, ...(a.alt || []), b.genre, b.tagline, PERIOD[b.period].name].join(" "));
  });

  const pathsOf = (id) => PATHS.map((p) => ({ path: p, index: p.steps.findIndex((s) => s.id === id) })).filter((x) => x.index > -1);

  /* ───────────── Okuma durumu (localStorage) ───────────── */
  const STORE_KEY = "klasikler.okunan.v1";
  const VIEW_KEY = "klasikler.gorunum";
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* gizli sekme vb. */ } }
  };
  const read = new Set((store.get(STORE_KEY, []) || []).filter((id) => BOOK[id]));
  const saveRead = () => store.set(STORE_KEY, [...read]);

  function scopeBooks(scope) {
    const [kind, id] = scope.split(":");
    if (kind === "level") return byLevel(id);
    if (kind === "path") return PATH[id].steps.map((s) => BOOK[s.id]);
    if (kind === "cat") return BOOKS.filter((b) => b.categories.includes(id));
    if (kind === "period") return BOOKS.filter((b) => b.period === id);
    if (kind === "must") return BOOKS.filter((b) => b.stars === 5);
    return BOOKS;
  }
  const countRead = (list) => list.filter((b) => read.has(b.id)).length;

  function toggleRead(id) {
    const b = BOOK[id];
    if (!b) return;
    const nowRead = !read.has(id);
    nowRead ? read.add(id) : read.delete(id);
    saveRead();
    syncReadUI(id);
    refreshProgress();
    toast(nowRead ? `“${b.title}” okundu olarak işaretlendi` : `“${b.title}” okunmadı olarak işaretlendi`, nowRead ? "check" : "reset");
    if (currentRoute && currentRoute.name === "ilerleme") render({ keepScroll: true });
    if (currentRoute && currentRoute.name === "kitaplar" && currentRoute.refresh) currentRoute.refresh();
  }

  function syncReadUI(id) {
    const isRead = read.has(id);
    $$(`[data-book="${id}"]`).forEach((el) => el.classList.toggle("is-read", isRead));
    $$(`[data-toggle-read="${id}"]`).forEach((btn) => {
      btn.setAttribute("aria-pressed", String(isRead));
      const label = $(".read-toggle__label", btn);
      if (label) label.textContent = isRead ? "Okudum" : "Okumadım";
      const box = $(".read-toggle__box", btn);
      if (box && isRead) { box.classList.remove("pop"); void box.offsetWidth; box.classList.add("pop"); }
    });
  }

  function refreshProgress() {
    const total = BOOKS.length, done = read.size, p = pct(done, total);
    const ring = $("#header-ring");
    if (ring) ring.style.setProperty("--p", p);
    const txt = $("#header-progress");
    if (txt) txt.textContent = `%${p}`;
    $$("[data-progress]").forEach((el) => {
      const list = scopeBooks(el.dataset.progress);
      const d = countRead(list), q = pct(d, list.length);
      if (el.classList.contains("progress__bar")) el.style.setProperty("--p", q + "%");
      else if (el.classList.contains("big-ring") || el.classList.contains("ring")) el.style.setProperty("--p", q);
      else if (el.dataset.format === "pct") el.textContent = `%${q}`;
      else el.textContent = `${d} / ${list.length}`;
    });
  }

  let toastTimer;
  function toast(msg, ico = "check") {
    const el = $("#toast");
    el.innerHTML = `${icon(ico)}<span>${esc(msg)}</span>`;
    el.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-show"), 2400);
  }

  /* ───────────── Bileşenler ───────────── */
  const palette = (b) => K.coverPalette[b.categories[0]] || K.coverPalette.epik;
  const lvlVar = (levelId) => `--lvl: var(--lvl-${levelId})`;
  const badgeOf = (b) => K.rating.badges[b.stars];

  function cover(b, size = "") {
    const p = palette(b);
    const len = b.title.length;
    const tcls = len > 24 ? "is-xlong" : len > 13 ? "is-long" : "";
    const light = b.categories[0] === "felsefe" ? " book--light" : "";
    return `<div class="book ${size ? "book--" + size : ""}${light}" style="--cover-bg:${p.bg};--cover-ink:${p.ink};--cover-text:${p.text}" aria-hidden="true">
      <div class="book__frame">
        <div class="book__band"></div>
        <div class="book__num">№ ${pad(b.order)}</div>
        ${motif(b.motif, "motif book__motif")}
        <div class="book__title ${tcls}">${esc(b.title)}</div>
        <div class="book__author">${esc(AUTH[b.author].name.replace(/[“”"]/g, ""))}</div>
        <div class="book__band"></div>
      </div>
    </div>`;
  }

  function stars(n, label = true) {
    let s = "";
    for (let i = 1; i <= 5; i++) s += i <= n ? icon("star") : icon("star-o", "ico off");
    return `<span class="stars" ${label ? `role="img" aria-label="5 üzerinden ${n} yıldız"` : 'aria-hidden="true"'}>${s}</span>`;
  }

  function badge(b) {
    const bd = badgeOf(b);
    if (b.stars === 5) return `<span class="chip chip--must">${icon("sparkle")}${esc(bd.label)}</span>`;
    return `<span class="chip chip--badge${b.stars >= 4 ? 4 : 3}">${esc(bd.label)}</span>`;
  }

  const levelChip = (levelId) => `<span class="chip chip--lvl" style="${lvlVar(levelId)}">${esc(LEVEL[levelId].short)}</span>`;

  function readToggle(b, variant = "") {
    const on = read.has(b.id);
    return `<button type="button" class="read-toggle ${variant}" data-toggle-read="${b.id}" aria-pressed="${on}" aria-label="${esc(b.title)}: okuma durumu">
      <span class="read-toggle__box">${icon("check")}</span><span class="read-toggle__label">${on ? "Okudum" : "Okumadım"}</span>${variant ? "<small>işaretlemek için tıkla</small>" : ""}
    </button>`;
  }

  function bookCard(b, opts = {}) {
    const a = AUTH[b.author];
    const isRead = read.has(b.id);
    return `<article class="book-card${isRead ? " is-read" : ""}" data-book="${b.id}" style="${lvlVar(b.level)}">
      <a class="book-card__link" href="#/kitap/${b.id}" aria-label="${esc(b.title)} — ${esc(a.name)}">
        <div class="book-card__shelf">
          ${opts.step ? `<span class="book-card__step">Adım ${b.step}</span>` : ""}
          <span class="book-card__order" title="Kronolojik okuma sırası">№ ${pad(b.order)}</span>
          ${cover(b)}
          <span class="book-card__read-flag">${icon("check")}Okundu</span>
        </div>
        <div class="book-card__body">
          <div class="book-card__badges">${levelChip(b.level)}${badge(b)}</div>
          <h3 class="book-card__title">${esc(b.title)}</h3>
          ${b.subtitle ? `<div class="book-card__sub">${esc(b.subtitle)}</div>` : ""}
          <div class="book-card__author">${esc(a.name)}</div>
          <div class="book-card__meta">
            <span>${icon("calendar")}${esc(b.date)}</span>
            <span>${icon("feather")}${esc(b.genre)}</span>
            <span>${icon("layers")}${esc(PERIOD[b.period].name)}</span>
          </div>
          ${opts.tagline === false ? "" : `<p class="book-card__tagline">${esc(b.tagline)}</p>`}
          <div class="book-card__rating">${stars(b.stars)}</div>
        </div>
      </a>
      <div class="book-card__foot">${readToggle(b)}</div>
    </article>`;
  }

  const shortDate = (d) => d.replace(/\s*[(;].*$/, "");

  function mini(b, extra = "") {
    return `<a class="mini${read.has(b.id) ? " is-read" : ""}" data-book="${b.id}" href="#/kitap/${b.id}" style="${lvlVar(b.level)}">
      ${cover(b, "xs")}
      <span><span class="mini__t">${esc(b.title)}</span>
      <span class="mini__a"><i class="mini__dot" title="${esc(LEVEL[b.level].name)}"></i>${esc(AUTH[b.author].name)} · ${esc(shortDate(b.date))}${extra}</span></span>
    </a>`;
  }

  const progressBar = (scope) => { const l = scopeBooks(scope); return `<div class="progress"><div class="progress__bar" data-progress="${scope}" style="--p:${pct(countRead(l), l.length)}%"></div></div>`; };
  const progressText = (scope) => { const l = scopeBooks(scope); return `<span data-progress="${scope}">${countRead(l)} / ${l.length}</span>`; };

  function pageHero({ eyebrow, title, lead, motifName, crumbs = [], extra = "", style = "", decor = "", cls = "" }) {
    const bc = crumbs.length
      ? `<nav class="breadcrumb" aria-label="Konum">${[["Ana Sayfa", "#/"], ...crumbs].map(([t, h], i, arr) => (i < arr.length - 1 ? `<a href="${h}">${esc(t)}</a>${icon("chevron-right")}` : `<span aria-current="page">${esc(t)}</span>`)).join("")}</nav>`
      : "";
    return `<section class="page-hero ${cls}" style="${style}">
      ${motifName ? motif(motifName, "motif page-hero__motif") : ""}
      ${decor}
      <div class="container">
        ${bc}
        ${eyebrow ? `<div class="eyebrow" style="margin-top:${crumbs.length ? "22px" : "0"}">${esc(eyebrow)}</div>` : ""}
        <h1>${title}</h1>
        ${lead ? `<p class="lead">${lead}</p>` : ""}
        ${extra}
      </div>
      <div class="meander meander--sm" aria-hidden="true"></div>
    </section>`;
  }

  function levelCards() {
    return `<div class="levels">${LEVELS.map((l, i) => {
      const list = byLevel(l.id);
      const scope = "level:" + l.id;
      return `<a class="level-card reveal" style="${lvlVar(l.id)};--d:${i * 0.08}s" href="#/seviye/${l.id}">
        <div class="level-card__top">
          <span class="level-card__greek" aria-hidden="true">${l.greek}</span>
          <div class="level-card__num">Seviye ${l.numeral}</div>
          <h3 class="level-card__name">${esc(l.short)}</h3>
          <div class="level-card__tag">${esc(l.tagline)}${l.id === "uzman" ? " · Derinleşme" : ""}</div>
        </div>
        <div class="level-card__body">
          <p class="level-card__desc">${esc(l.desc)}</p>
          <ul class="level-card__titles">${list.slice(0, 4).map((b) => `<li>${esc(b.title)}</li>`).join("")}${list.length > 4 ? `<li>ve ${list.length - 4} eser daha</li>` : ""}</ul>
          <div class="level-card__foot">
            <div class="level-card__meta"><span><b>${list.length}</b> eser</span><span>Okunan: <b>${progressText(scope)}</b></span></div>
            ${progressBar(scope)}
            <span class="level-card__cta">Eserleri gör ${icon("arrow-right")}</span>
          </div>
        </div>
      </a>${i < LEVELS.length - 1 ? `<span class="levels__arrow" aria-hidden="true" style="left:calc(${((i + 1) / LEVELS.length) * 100}% + ${(((i + 1) / LEVELS.length) - 0.5) * 18}px)">${icon("chevron-right")}</span>` : ""}`;
    }).join("")}</div>`;
  }

  /* Kronolojik şerit (ana sayfa): yüzyıl sütunları, yazar bazında gruplanmış eserler */
  const STRIP_CENTURIES = [-8, -7, -6, -5, -4, -3, -2, 1, 2, 3];
  const STRIP_PERIODS = [["arkaik", 3], ["klasik", 2], ["helenistik", 2], ["roma", 3]];
  function eraStrip() {
    const cols = STRIP_CENTURIES.map((c) => {
      const books = BOOKS.filter((b) => centuryOf(b.year) === c);
      const authors = [];
      books.forEach((b) => { if (!authors.includes(b.author)) authors.push(b.author); });
      return `<div class="era-col">
        <div class="era-col__head"><div class="era-col__c">${centuryShort(c)}</div><div class="era-col__n">${books.length} eser</div></div>
        <div class="era-col__list">${authors.map((aid) => {
          const works = books.filter((b) => b.author === aid);
          return `<div class="era-chip" style="grid-template-columns:1fr">
            <div><b>${esc(AUTH[aid].name)}</b>
            <span>${works.map((w) => `<a href="#/kitap/${w.id}" data-book="${w.id}" class="${read.has(w.id) ? "is-read" : ""}" style="color:#d9d2c1;border-bottom:1px dotted rgba(207,171,101,.4)">${esc(w.title)}</a>`).join(" · ")}</span></div>
          </div>`;
        }).join("")}</div>
      </div>`;
    }).join("");
    const periods = STRIP_PERIODS.map(([id, span]) => `<div class="era-period" style="grid-column:span ${span};--pc:var(--p-${id})"><b>${esc(PERIOD[id].name)}</b><span>${esc(PERIOD[id].range)}</span></div>`).join("");
    return `<div class="era-strip" tabindex="0" aria-label="Yüzyıllara göre eserler (yatay kaydırılabilir)"><div class="era-strip__inner">${periods}${cols}</div></div>`;
  }

  /* Harita */
  const MAJOR_PLACES = new Set(["atina", "troia", "smyrna", "miletos", "ephesos", "halikarnassos", "mytilene", "stageira", "iskenderiye", "roma", "samosata", "hierapolis", "syrakusai", "sparta", "delphoi", "knossos", "elea"]);
  const ANATOLIA = new Set(["troia", "lampsakos", "assos", "kyme", "smyrna", "ephesos", "miletos", "halikarnassos", "hierapolis", "samosata"]);
  function placeInfo(pid) {
    const authors = Object.entries(AUTH).filter(([, a]) => (a.places || []).includes(pid)).map(([id]) => id);
    const note = K.placeNotes[pid];
    return { authors, note };
  }
  function mapHTML() {
    const M = K.map;
    const places = M.places.map((p) => {
      const info = placeInfo(p.id);
      const kind = info.authors.length ? "author" : "landmark";
      const dx = { e: 9, w: -9, n: 0, s: 0, nw: -6, sw: -6, ne: 6, se: 6 }[p.anchor] ?? 9;
      const dy = { e: 5, w: 5, n: -10, s: 20, nw: -8, sw: 16, ne: -8, se: 16 }[p.anchor] ?? 5;
      const ta = /w/.test(p.anchor) ? "end" : /e/.test(p.anchor) ? "start" : "middle";
      const cls = ["place", kind === "landmark" ? "landmark" : "", ANATOLIA.has(p.id) ? "anatolia" : "", MAJOR_PLACES.has(p.id) ? "" : "minor"].join(" ");
      return `<g class="${cls}" data-place="${p.id}" tabindex="0" role="button" aria-label="${esc(p.name)} (${esc(p.modern)})">
        <circle class="halo" cx="${p.x}" cy="${p.y}" r="15"></circle>
        <circle class="dot" cx="${p.x}" cy="${p.y}" r="${kind === "author" ? 5.5 : 4.5}"></circle>
        <text x="${p.x + dx}" y="${p.y + dy}" text-anchor="${ta}">${esc(p.name)}</text>
        <circle class="hit" cx="${p.x}" cy="${p.y}" r="8"></circle>
      </g>`;
    }).join("");
    const seas = M.seas.map((s) => `<text class="sea-label" x="${s.x}" y="${s.y}" text-anchor="middle">${esc(upperTR(s.name))}</text>`).join("");
    return `<div class="map-wrap">
      <div class="map">
        <svg viewBox="0 0 ${M.width} ${M.height}" role="group" aria-label="Antik Yunan dünyası haritası: yazarların doğduğu ve çalıştığı yerler">
          <defs><radialGradient id="seaGrad" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#22355e"/><stop offset="1" stop-color="#101a31"/></radialGradient></defs>
          <rect class="sea" width="${M.width}" height="${M.height}"></rect>
          <path class="grid-lines" d="${M.grid}"></path>
          <path class="land" d="${M.land}"></path>
          ${seas}
          <g class="compass-rose" transform="translate(${M.compass.x - 34} ${M.compass.y - 34}) scale(1.06)"><use href="#m-compass" width="64" height="64" style="fill:none;stroke:currentColor;stroke-width:1.3"></use></g>
          ${places}
        </svg>
      </div>
      <aside class="card map-panel" id="map-panel" aria-live="polite">${mapPanelDefault()}</aside>
    </div>`;
  }
  function placeSelect(current = "") {
    const opts = [...K.map.places].sort((a, b) => a.name.localeCompare(b.name, "tr"))
      .map((p) => `<option value="${p.id}"${p.id === current ? " selected" : ""}>${esc(p.name)} — ${esc(p.modern)}</option>`).join("");
    return `<div class="select"><label for="map-select">Bir yer seçin</label><select id="map-select" data-map-select><option value="">Tüm yerler (${K.map.places.length})</option>${opts}</select>${icon("chevron-down")}</div>`;
  }
  function mapPanelDefault() {
    const anatolian = Object.entries(AUTH).filter(([, a]) => a.anatolia).map(([id]) => id);
    return `<div class="eyebrow">Keşfet</div>
      <h3>Klasiklerin coğrafyası</h3>
      <p>Haritadaki bir noktaya dokunarak ya da aşağıdan bir yer seçerek orada doğmuş veya çalışmış yazarları ve eserlerini görün. Antik Yunan edebiyatının önemli bir kısmı Ege'nin iki yakasında, Anadolu kıyılarında ve adalarda doğdu.</p>
      ${placeSelect()}
      <div class="map-author"><b>Anadolu ile bağlantılı yazarlar</b>
        <div class="works">${anatolian.map((id) => `<a href="#/kitap/${booksOf(id)[0].id}">${esc(AUTH[id].name)}</a>`).join("")}</div>
      </div>
      <div class="map-legend">
        <span><i style="--c:var(--gold)"></i>Yazar merkezi</span>
        <span><i style="--c:#9a4e2a"></i>Anadolu</span>
        <span><i style="--c:var(--navy-600)"></i>Mitolojik / tarihî yer</span>
      </div>`;
  }
  function mapPanelFor(pid) {
    const p = K.map.places.find((x) => x.id === pid);
    const { authors, note } = placeInfo(pid);
    return `${placeSelect(pid)}<div class="eyebrow">${ANATOLIA.has(pid) ? "Anadolu" : "Antik yer"}</div>
      <h3>${esc(p.name)}</h3>
      <div class="modern">${icon("pin")}Bugün: ${esc(p.modern)}</div>
      ${note ? `<p>${esc(note.note)}</p>` : ""}
      <div class="map-panel__authors">
        ${authors.map((aid) => {
          const a = AUTH[aid];
          return `<div class="map-author"><b>${esc(a.name)}</b><span style="font-size:12.5px;color:var(--muted)">${esc(a.life)}</span>
            <div class="works">${booksOf(aid).map((b) => `<a href="#/kitap/${b.id}">${esc(b.title)}</a>`).join("")}</div></div>`;
        }).join("")}
        ${note && note.books.length ? `<div class="map-author"><b>Burada geçen / bununla ilgili eserler</b><div class="works">${note.books.map((id) => `<a href="#/kitap/${id}">${esc(BOOK[id].title)}</a>`).join("")}</div></div>` : ""}
      </div>
      <button class="btn btn--outline btn--sm" type="button" data-map-reset style="align-self:flex-start">${icon("reset")}Genel görünüm</button>`;
  }
  function mountMap(root) {
    const panel = $("#map-panel", root);
    if (!panel) return;
    const select = (g, scroll = true) => {
      $$(".place.is-active", root).forEach((x) => x.classList.remove("is-active"));
      g.classList.add("is-active");
      panel.innerHTML = mapPanelFor(g.dataset.place);
      if (scroll && window.matchMedia("(max-width: 1080px)").matches) panel.scrollIntoView({ behavior: scrollBehavior(), block: "nearest" });
    };
    $$(".place", root).forEach((g) => {
      g.addEventListener("click", () => select(g));
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(g); } });
    });
    const reset = () => {
      $$(".place.is-active", root).forEach((x) => x.classList.remove("is-active"));
      panel.innerHTML = mapPanelDefault();
    };
    panel.addEventListener("click", (e) => { if (e.target.closest("[data-map-reset]")) reset(); });
    panel.addEventListener("change", (e) => {
      const sel = e.target.closest("[data-map-select]");
      if (!sel) return;
      const g = sel.value && $(`.place[data-place="${sel.value}"]`, root);
      if (g) { select(g, false); $("#map-select", root)?.focus(); } else reset();
    });
  }

  /* Puanlama açıklaması (koyu bölüm içinde) */
  function ratingExplain() {
    return `<div class="rating-explain">
      <div>
        <div class="criteria">${K.rating.criteria.map((c, i) => `<div class="criterion reveal" style="--d:${i * 0.08}s"><span class="criterion__n">${i + 1}</span><div><h4>${esc(c.name)}</h4><p>${esc(c.desc)}</p></div></div>`).join("")}</div>
        <p class="formula">Her eser bu üç ölçütte 1–5 arasında puanlanır; yıldız sayısı üç puanın ortalamasının yuvarlanmasıyla bulunur. Örneğin Theogonia: tarihsel önem 5, edebî değer 3, etki 4 → <code>(5 + 3 + 4) / 3 = 4</code> → ${stars(4, false)} <b style="color:var(--gold-3)">Önemli</b>. Puanlar bu rehberin editoryal değerlendirmesidir; bir eserin “daha az yıldızlı” olması okunmaya değmediği anlamına gelmez.</p>
      </div>
      <div class="badge-legend">${[5, 4, 3].map((n, i) => `<div class="badge-row reveal" style="--d:${i * 0.08}s">${stars(n, false)}<div><b>${esc(K.rating.badges[n].label)}</b><p>${esc(K.rating.badges[n].desc)} (${BOOKS.filter((b) => b.stars === n).length} eser)</p></div></div>`).join("")}</div>
    </div>`;
  }

  /* Hero sütunu (İon düzeni) */
  function columnSVG(id) {
    const flutes = Array.from({ length: 9 }, (_, i) => { const t = (i + 1) / 10; const xt = 31 + t * 78, xb = 27 + t * 86; return `<path d="M${xt.toFixed(1)} 56L${xb.toFixed(1)} 586" stroke="rgba(120,100,70,.28)" stroke-width="1.2"/><path d="M${(xt + 2.2).toFixed(1)} 56L${(xb + 2.4).toFixed(1)} 586" stroke="rgba(255,255,255,.35)" stroke-width="1"/>`; }).join("");
    const eggs = Array.from({ length: 6 }, (_, i) => `<ellipse cx="${44 + i * 10.4}" cy="40" rx="3.6" ry="5" fill="url(#${id}m)" stroke="rgba(120,100,70,.4)" stroke-width=".8"/>`).join("");
    const volute = (cx) => `<circle cx="${cx}" cy="30" r="17" fill="url(#${id}m)" stroke="rgba(150,120,70,.55)" stroke-width="1.2"/><circle cx="${cx}" cy="30" r="11.5" fill="none" stroke="rgba(150,120,70,.5)" stroke-width="1.1"/><circle cx="${cx}" cy="30" r="6.5" fill="none" stroke="rgba(150,120,70,.5)" stroke-width="1"/><circle cx="${cx}" cy="30" r="2.6" fill="rgba(150,120,70,.6)"/>`;
    return `<svg class="hero__col hero__col--${id}" viewBox="0 0 140 640" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="#8d8472"/><stop offset=".22" stop-color="#e9e2d2"/><stop offset=".45" stop-color="#fbf7ee"/><stop offset=".75" stop-color="#d9d0bd"/><stop offset="1" stop-color="#6f675a"/></linearGradient>
        <linearGradient id="${id}m" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f7f2e6"/><stop offset="1" stop-color="#cfc5b0"/></linearGradient>
      </defs>
      <rect x="2" y="0" width="136" height="11" rx="1.5" fill="url(#${id}m)" stroke="rgba(150,120,70,.5)"/>
      <path d="M14 11h112v14c-12 6-22 8-56 8S26 31 14 25z" fill="url(#${id}s)" stroke="rgba(150,120,70,.45)"/>
      ${volute(22)}${volute(118)}${eggs}
      <rect x="27" y="47" width="86" height="9" fill="url(#${id}s)" stroke="rgba(150,120,70,.35)"/>
      <path d="M31 56h78l4 530H27z" fill="url(#${id}s)"/>
      ${flutes}
      <rect x="18" y="586" width="104" height="13" rx="6.5" fill="url(#${id}s)" stroke="rgba(150,120,70,.35)"/>
      <rect x="25" y="599" width="90" height="7" fill="#b9ae98"/>
      <rect x="12" y="606" width="116" height="14" rx="7" fill="url(#${id}s)" stroke="rgba(150,120,70,.35)"/>
      <rect x="4" y="620" width="132" height="20" fill="url(#${id}m)" stroke="rgba(150,120,70,.4)"/>
    </svg>`;
  }
  const templeSVG = () => `<svg class="hero__temple" viewBox="0 0 1100 300" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M60 110L550 14l490 96z"/><path d="M110 104L550 30l440 74"/><path d="M60 110h980v22H60zM60 132h980v16H60z"/>
    ${Array.from({ length: 12 }, (_, i) => { const x = 110 + i * 80; return `<path d="M${x} 148v124M${x + 34} 148v124M${x + 11} 150v120M${x + 23} 150v120"/><path d="M${x - 6} 148h46"/>`; }).join("")}
    <path d="M40 272h1020v14H40zM20 286h1060v14H20z"/>
  </svg>`;

  /* ───────────── Sayfalar ───────────── */

  function viewHome() {
    const must = BOOKS.filter((b) => b.stars === 5);
    const beginner = PATH["yeni-baslayanlar"];
    const doneAll = read.size;
    const html = `
    <section class="hero">
      <div class="hero__bg" aria-hidden="true"></div>
      <div class="hero__glow" aria-hidden="true"></div>
      ${templeSVG()}${columnSVG("l")}${columnSVG("r")}
      <div class="container hero__inner view-enter">
        <div class="hero__greek"><span lang="grc">ΓΝΩΘΙ ΣΕΑΥΤΟΝ</span><span class="hero__greek-tr">· kendini bil</span></div>
        <h1 class="hero__title"><span class="l1">Antik Yunan</span><span class="l2">Klasikleri</span></h1>
        <p class="hero__sub">Mitolojiden felsefeye, <em>Homeros'tan Aristoteles'e</em> uzanan kronolojik okuma rehberi. Ne okuyacağınızı, hangi sırayla ve neden okuyacağınızı adım adım keşfedin.</p>
        <div class="hero__cta">
          <a class="btn btn--gold" href="#/seviye/baslangic">Okumaya Başla ${icon("arrow-right")}</a>
          <a class="btn btn--ghost-light" href="#/yol-haritasi">${icon("route")}Kronolojik Yol Haritası</a>
        </div>
        ${doneAll ? `<div class="hero__resume">${icon("bookmark")}<span>Okuma ilerlemen: <b data-progress="all" data-format="pct">%${pct(doneAll, BOOKS.length)}</b></span>${progressBar("all")}<a href="#/ilerleme" style="color:var(--gold-3);font-weight:600">Devam et</a></div>` : ""}
        <div class="hero__stats">
          <div class="hero__stat"><b>${BOOKS.length}</b><span>Klasik eser</span></div>
          <div class="hero__stat"><b>${AUTHOR_ORDER.length}</b><span>Yazar</span></div>
          <div class="hero__stat"><b>4</b><span>Okuma seviyesi</span></div>
          <div class="hero__stat"><b>${PATHS.length}</b><span>Okuma yolu</span></div>
          <div class="hero__stat"><b>~1000</b><span>Yıllık yolculuk</span></div>
        </div>
      </div>
      <div class="meander" aria-hidden="true"></div>
    </section>

    <section class="section section--marble" id="seviyeler">
      <div class="container">
        <div class="section-head section-head--center reveal">
          <div class="eyebrow">Okuma Yolculuğunu Seç</div>
          <h2 class="section-title">Başlangıçtan uzmanlığa dört seviye</h2>
          <p class="section-lead">Her seviye, bir öncekinin üzerine kurulur. Nereden başlayacağınızı bilmiyorsanız Başlangıç seviyesindeki ilk eserle, Homeros'un İlyada'sıyla yola çıkın.</p>
        </div>
        ${levelCards()}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="head-row reveal">
          <div class="section-head">
            <div class="eyebrow">Temel Taşlar</div>
            <h2 class="section-title">Kesinlikle okunması gerekenler</h2>
            <p class="section-lead">Tarihsel önem, edebî ve düşünsel değer ile sonraki kültüre etkisi bakımından en yüksek puanı alan ${must.length} eser. Batı edebiyatı ve felsefesinin ortak zemini bu kitaplardır.</p>
          </div>
          <div class="shelf-nav"><button type="button" data-shelf="-1" aria-label="Önceki eserler">${icon("arrow-left")}</button><button type="button" data-shelf="1" aria-label="Sonraki eserler">${icon("arrow-right")}</button></div>
        </div>
        <div class="shelf-scroll" id="must-shelf">${must.map((b) => bookCard(b)).join("")}</div>
      </div>
    </section>

    <section class="section section--dark">
      <div class="container">
        <div class="head-row reveal">
          <div class="section-head">
            <div class="eyebrow">Kronolojik Yol Haritası</div>
            <h2 class="section-title">Yüzyıllar boyunca bir düşünce yolculuğu</h2>
            <p class="section-lead">Homeros'un destanlarından Arkaik lirik şiire, Atina tiyatrosundan Platon ve Aristoteles'e, Helenistik bilimden Roma dönemi Stoacılarına: eserlerin tarihsel gelişimi. Bir esere tıklayarak ayrıntılarına ulaşın.</p>
          </div>
          <a class="btn btn--ghost-light" href="#/yol-haritasi">Ayrıntılı zaman çizelgesi ${icon("arrow-right")}</a>
        </div>
        <div class="reveal">${eraStrip()}</div>
      </div>
    </section>

    <section class="section section--dark" style="padding-top:0">
      <div class="container">
        <div class="head-row reveal">
          <div class="section-head">
            <div class="eyebrow">Önerilen Okuma Yolu</div>
            <h2 class="section-title">${esc(beginner.name)}</h2>
            <p class="section-lead">${esc(beginner.desc)} Sıralama popülerliğe göre değil, her eserin bir sonrakini anlamaya katkısına göre yapıldı.</p>
          </div>
          <a class="btn btn--gold" href="#/okuma-yollari/${beginner.id}">Yolu başlat ${icon("arrow-right")}</a>
        </div>
        <ol class="path-preview reveal">${beginner.steps.map((s, i) => {
          const b = BOOK[s.id];
          return `<li class="path-preview__item"><a class="path-preview__link" href="#/kitap/${b.id}">
            <span class="path-preview__n">${pad(i + 1)}</span>
            <span class="path-preview__t">${esc(b.title)}</span>
            <span class="path-preview__a">${esc(AUTH[b.author].name)} · ${esc(LEVEL[b.level].short)}</span>
          </a></li>`;
        }).join("")}</ol>
      </div>
    </section>

    <section class="section section--marble">
      <div class="container">
        <div class="head-row reveal">
          <div class="section-head">
            <div class="eyebrow">Kategoriler</div>
            <h2 class="section-title">Destandan felsefeye, türlere göre keşfedin</h2>
          </div>
          <a class="btn btn--outline" href="#/kategoriler">Tüm kategoriler ${icon("arrow-right")}</a>
        </div>
        ${categoryGrid()}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <div class="eyebrow">Klasiklerin Haritası</div>
          <h2 class="section-title">Ege'nin iki yakasında doğan bir edebiyat</h2>
          <p class="section-lead">Homeros'un İonia'sından Herodotos'un Halikarnassos'una, Epiktetos'un Hierapolis'inden Lukianos'un Samosata'sına: yazarların doğduğu ve çalıştığı yerler.</p>
        </div>
        <div class="reveal">${mapHTML()}</div>
      </div>
    </section>

    <section class="section section--dark">
      <div class="container">
        <div class="section-head reveal">
          <div class="eyebrow">Puanlama</div>
          <h2 class="section-title">Yıldızlar ne anlama geliyor?</h2>
          <p class="section-lead">Yıldızlar bir eserin “beğenilme” derecesini değil, Antik Yunan klasikleri içindeki yerini gösterir. Her eser üç ölçüte göre değerlendirilir.</p>
        </div>
        ${ratingExplain()}
      </div>
    </section>`;

    return {
      title: "Antik Yunan Klasikleri — Kronolojik Okuma Yol Haritası",
      nav: "",
      html,
      mount(root) {
        mountMap(root);
        const shelf = $("#must-shelf", root);
        $$("[data-shelf]", root).forEach((btn) => btn.addEventListener("click", () => shelf.scrollBy({ left: Number(btn.dataset.shelf) * shelf.clientWidth * 0.8, behavior: scrollBehavior() })));
      }
    };
  }

  function categoryGrid(full = false) {
    return `<div class="cat-grid">${CATS.map((c, i) => {
      const list = BOOKS.filter((b) => b.categories.includes(c.id));
      const p = K.coverPalette[c.id];
      const light = c.id === "felsefe";
      return `<a class="cat-card reveal${light ? " cat-card--light" : ""}" style="--cover-bg:${p.bg};--cover-ink:${p.ink};--cover-text:${p.text};--d:${(i % 4) * 0.06}s" href="#/kitaplar?kategori=${c.id}">
        ${motif(c.motif, "motif cat-card__bgmotif")}
        ${motif(c.motif)}
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.desc)}</p>
        ${full ? `<div class="cat-card__titles">${list.slice(0, 5).map((b) => esc(b.title)).join(" · ")}${list.length > 5 ? " …" : ""}</div>` : ""}
        <div class="cat-card__count"><span>${list.length} eser</span>${icon("arrow-right")}</div>
      </a>`;
    }).join("")}</div>`;
  }

  function viewLevels() {
    const html = `${pageHero({
      eyebrow: "Okuma Seviyeleri",
      title: "Dört seviyede Antik Yunan",
      lead: "Eserler, dilinin ve fikir yapısının ne kadar erişilebilir olduğuna ve hangi ön bilgileri gerektirdiğine göre dört seviyeye ayrıldı. Her seviyenin içinde eserler kronolojik sırayla dizilir.",
      motifName: "column",
      crumbs: [["Seviyeler", "#/seviyeler"]]
    })}
    <section class="section section--marble"><div class="container">${levelCards()}</div></section>
    ${LEVELS.map((l, i) => {
      const list = byLevel(l.id);
      return `<section class="section section--tight${i % 2 ? " section--marble" : ""}">
        <div class="container">
          <div class="head-row reveal">
            <div class="section-head">
              <div class="eyebrow" style="color:var(--lvl-${l.id})">Seviye ${l.numeral} · ${l.greek}</div>
              <h2 class="section-title">${esc(l.name)}</h2>
              <p class="section-lead">${esc(l.long)}</p>
            </div>
            <a class="btn btn--navy" href="#/seviye/${l.id}">${esc(l.short)} seviyesini aç ${icon("arrow-right")}</a>
          </div>
          <div class="grid grid--3">${list.map((b) => mini(b, ` · Adım ${b.step}`)).join("")}</div>
        </div>
      </section>`;
    }).join("")}`;
    return { title: "Okuma Seviyeleri — Antik Yunan Klasikleri", nav: "seviyeler", html };
  }

  function viewLevel(id) {
    const l = LEVEL[id];
    if (!l) return viewNotFound();
    const idx = LEVELS.indexOf(l);
    const list = byLevel(id);
    const nextL = LEVELS[idx + 1], prevL = LEVELS[idx - 1];
    const scope = "level:" + id;
    const tabs = `<div class="path-tabs" role="tablist" aria-label="Seviyeler" style="margin-top:26px">${LEVELS.map((x) => `<a class="path-tab${x.id === id ? " is-active" : ""}" role="tab" aria-selected="${x.id === id}" href="#/seviye/${x.id}"><span style="font-family:var(--font-display);font-size:20px;color:${x.id === id ? "var(--gold-2)" : `var(--lvl-${x.id})`}">${x.greek}</span>${esc(x.short)}</a>`).join("")}</div>`;
    const html = `${pageHero({
      eyebrow: `Seviye ${l.numeral}`,
      title: `${esc(l.name)} <span style="font-size:.5em;color:var(--gold-2);font-style:italic;font-weight:500">· ${esc(l.tagline)}</span>`,
      lead: esc(l.long),
      crumbs: [["Seviyeler", "#/seviyeler"], [l.short, "#/seviye/" + id]],
      style: `--tint: var(--lvl-${id})`,
      cls: "page-hero--tinted",
      extra: `<div class="stat-row">
        <div class="stat"><b>${list.length}</b><span>eser</span></div>
        <div class="stat"><b>${list.filter((b) => b.stars === 5).length}</b><span>“Kesinlikle Oku”</span></div>
        <div class="stat"><b>${progressText(scope)}</b><span>okundu</span></div>
        <div class="stat" style="min-width:220px;display:grid;gap:8px;align-content:center"><span>Seviye ilerlemesi</span>${progressBar(scope)}</div>
      </div>`,
      decor: `<span class="page-hero__letter" aria-hidden="true">${l.greek}</span>`
    })}
    <section class="section section--tight">
      <div class="container">
        ${tabs}
        <div class="results-bar"><p class="results-count">Bu seviyede <b>${list.length}</b> eser, yazılış tarihine göre kronolojik sırayla. <span style="color:var(--muted)">“Adım” numarası seviye içindeki önerilen sırayı, № ise bütün eserler arasındaki kronolojik sırayı gösterir.</span></p>
        <a class="btn btn--outline btn--sm" href="#/kitaplar?seviye=${id}">${icon("filter")}Bu seviyede filtrele</a></div>
        <div class="grid grid--books">${list.map((b) => bookCard(b, { step: true })).join("")}</div>
        <div class="section-foot">
          ${prevL ? `<a class="btn btn--outline" href="#/seviye/${prevL.id}">${icon("arrow-left")}${esc(prevL.name)}</a>` : ""}
          ${nextL ? `<a class="btn btn--navy" href="#/seviye/${nextL.id}">Sonraki: ${esc(nextL.name)} ${icon("arrow-right")}</a>` : `<a class="btn btn--navy" href="#/ilerleme">İlerlemeni gör ${icon("arrow-right")}</a>`}
        </div>
      </div>
    </section>`;
    return { title: `${l.name} — Antik Yunan Klasikleri`, nav: "seviyeler", html };
  }

  /* Tüm eserler: arama + filtreler */
  const SORTS = [
    ["kronolojik", "Kronolojik (eskiden yeniye)"],
    ["kronolojik-ters", "Kronolojik (yeniden eskiye)"],
    ["puan", "Yıldız puanı (yüksekten)"],
    ["seviye", "Seviye (kolaydan zora)"],
    ["ad", "Eser adı (A–Z)"],
    ["yazar", "Yazar adı (A–Z)"]
  ];

  function filterBooks(f) {
    const tokens = norm(f.q).split(" ").filter(Boolean);
    let list = BOOKS.filter((b) => {
      if (f.seviye && b.level !== f.seviye) return false;
      if (f.yazar && b.author !== f.yazar) return false;
      if (f.donem && b.period !== f.donem) return false;
      if (f.tur && b.genreKey !== f.tur) return false;
      if (f.kategori) {
        if (f.kategori === "edebiyat") { if (!b.categories.some((c) => CAT[c].group === "edebiyat")) return false; }
        else if (!b.categories.includes(f.kategori)) return false;
      }
      if (f.durum === "okunan" && !read.has(b.id)) return false;
      if (f.durum === "okunmayan" && read.has(b.id)) return false;
      if (f.temel && b.stars !== 5) return false;
      if (tokens.length && !tokens.every((t) => b._all.includes(t))) return false;
      return true;
    });
    const s = f.sirala || "kronolojik";
    const byTitle = (a, b) => a.title.localeCompare(b.title, "tr");
    if (s === "kronolojik-ters") list = list.slice().reverse();
    else if (s === "puan") list.sort((a, b) => b.stars - a.stars || a.order - b.order);
    else if (s === "seviye") list.sort((a, b) => a.levelIndex - b.levelIndex || a.order - b.order);
    else if (s === "ad") list.sort(byTitle);
    else if (s === "yazar") list.sort((a, b) => AUTH[a.author].name.replace(/[“”]/g, "").localeCompare(AUTH[b.author].name.replace(/[“”]/g, ""), "tr") || a.order - b.order);
    return list;
  }

  function viewBooks(query) {
    const f = {
      q: query.get("q") || "",
      seviye: LEVEL[query.get("seviye")] ? query.get("seviye") : "",
      yazar: AUTH[query.get("yazar")] ? query.get("yazar") : "",
      donem: PERIOD[query.get("donem")] ? query.get("donem") : "",
      tur: GENRE_NAME[query.get("tur")] ? query.get("tur") : "",
      kategori: CAT[query.get("kategori")] || query.get("kategori") === "edebiyat" ? query.get("kategori") : "",
      sirala: SORTS.some(([k]) => k === query.get("sirala")) ? query.get("sirala") : "kronolojik",
      durum: ["okunan", "okunmayan"].includes(query.get("durum")) ? query.get("durum") : "",
      temel: query.get("temel") === "1"
    };
    let viewMode = store.get(VIEW_KEY, "grid") === "list" ? "list" : "grid";

    const sel = (key, label, options, value) => `<div class="select"><label for="f-${key}">${label}</label>
      <select id="f-${key}" data-filter="${key}" class="${value && key !== "sirala" ? "is-set" : ""}">${options.map(([v, t]) => `<option value="${esc(v)}"${v === value ? " selected" : ""}>${esc(t)}</option>`).join("")}</select>${icon("chevron-down")}</div>`;

    const html = `${pageHero({
      eyebrow: "Kitaplık",
      title: "Tüm Eserler",
      lead: `${BOOKS.length} klasik eseri seviyeye, yazara, döneme, türe ve kategoriye göre filtreleyin; eser ya da yazar adıyla arayın.`,
      motifName: "scroll",
      crumbs: [["Tüm Eserler", "#/kitaplar"]]
    })}
    <div class="toolbar">
      <div class="container">
        <div class="toolbar__row">
          <div class="search-field">${icon("search")}<input id="f-q" type="search" placeholder="Eser ya da yazar ara… (ör. İlyada, Eflatun, Stoa)" value="${esc(f.q)}" aria-label="Eser ya da yazar ara"><button type="button" class="clear" data-clear-q aria-label="Aramayı temizle" ${f.q ? "" : "hidden"}>${icon("close")}</button></div>
          <button type="button" class="toggle-chip" data-toggle="temel" aria-pressed="${f.temel}">${icon("sparkle")}Yalnızca “Kesinlikle Oku”</button>
          <div class="toolbar__sort">${sel("sirala", "Sıralama", SORTS, f.sirala)}</div>
          <button type="button" class="toggle-chip filters-btn" data-toggle-filters aria-expanded="false">${icon("filter")}Filtreler</button>
          <div class="view-toggle" role="group" aria-label="Görünüm">
            <button type="button" data-view="grid" aria-pressed="${viewMode === "grid"}" aria-label="Kart görünümü">${icon("grid")}</button>
            <button type="button" data-view="list" aria-pressed="${viewMode === "list"}" aria-label="Liste görünümü">${icon("list")}</button>
          </div>
        </div>
        <div class="filters" id="filters">
          ${sel("seviye", "Seviye", [["", "Tüm seviyeler"], ...LEVELS.map((l) => [l.id, l.name])], f.seviye)}
          ${sel("yazar", "Yazar", [["", "Tüm yazarlar"], ...AUTHOR_ORDER.map((a) => [a, AUTH[a].name])], f.yazar)}
          ${sel("donem", "Dönem", [["", "Tüm dönemler"], ...PERIODS.map((p) => [p.id, `${p.name} (${p.range})`])], f.donem)}
          ${sel("tur", "Tür", [["", "Tüm türler"], ...GENRES.filter(([k]) => BOOKS.some((b) => b.genreKey === k)).map(([k, n]) => [k, n])], f.tur)}
          ${sel("kategori", "Kategori", [["", "Tüm kategoriler"], ["edebiyat", "Edebiyat (tümü)"], ...CATS.map((c) => [c.id, c.name])], f.kategori)}
          ${sel("durum", "Okuma durumu", [["", "Tümü"], ["okunan", "Okuduklarım"], ["okunmayan", "Okumadıklarım"]], f.durum)}
        </div>
      </div>
    </div>
    <section class="section section--tight" style="padding-top:0">
      <div class="container">
        <div class="results-bar"><p class="results-count" id="results-count"></p><div class="active-filters" id="active-filters"></div></div>
        <div id="results"></div>
      </div>
    </section>`;

    function syncURL() {
      const qs = new URLSearchParams();
      for (const [k, v] of Object.entries(f)) {
        if (k === "sirala" && v === "kronolojik") continue;
        if (k === "temel") { if (v) qs.set(k, "1"); continue; }
        if (v) qs.set(k, v);
      }
      const s = qs.toString();
      history.replaceState(history.state, "", "#/kitaplar" + (s ? "?" + s : ""));
      lastHash = location.hash;
    }

    const LABELS = {
      seviye: (v) => LEVEL[v].name, yazar: (v) => AUTH[v].name, donem: (v) => PERIOD[v].name, tur: (v) => GENRE_NAME[v],
      kategori: (v) => (v === "edebiyat" ? "Edebiyat (tümü)" : CAT[v].name), durum: (v) => (v === "okunan" ? "Okuduklarım" : "Okumadıklarım"),
      q: (v) => `“${v}”`, temel: () => "Kesinlikle Oku"
    };

    function renderResults(root = document) {
      const list = filterBooks(f);
      const out = $("#results", root);
      $("#results-count", root).innerHTML = `<b>${list.length}</b> eser listeleniyor${list.length !== BOOKS.length ? ` <span>(toplam ${BOOKS.length})</span>` : ""}`;
      const active = Object.entries(f).filter(([k, v]) => v && !(k === "sirala"));
      $("#active-filters", root).innerHTML = active.map(([k, v]) => `<button type="button" data-remove="${k}" aria-label="Filtreyi kaldır: ${esc(LABELS[k](v))}">${esc(LABELS[k](v))}${icon("close")}</button>`).join("") +
        (active.length > 1 ? `<button type="button" data-remove="*">Tümünü temizle ${icon("reset")}</button>` : "");
      out.innerHTML = list.length
        ? `<div class="grid grid--books${viewMode === "list" ? " grid--list" : ""}">${list.map((b) => bookCard(b)).join("")}</div>`
        : `<div class="empty">${motif("amphora")}<h3>Bu ölçütlere uyan eser yok</h3><p>Aramayı ya da filtreleri değiştirmeyi deneyin.</p><div class="section-foot"><button type="button" class="btn btn--navy" data-remove="*">${icon("reset")}Filtreleri temizle</button></div></div>`;
    }

    return {
      title: "Tüm Eserler — Antik Yunan Klasikleri",
      nav: "kitaplar",
      html,
      // Okundu işaretlemesi kartları yerinde günceller; liste yalnızca okuma durumu filtresi varsa değişir
      refresh: () => { if (f.durum) renderResults(); },
      mount(root) {
        renderResults(root);
        const input = $("#f-q", root);
        const clearBtn = $("[data-clear-q]", root);
        const onInput = debounce(() => { f.q = input.value.trim(); clearBtn.hidden = !f.q; syncURL(); renderResults(root); }, 140);
        input.addEventListener("input", onInput);
        clearBtn.addEventListener("click", () => { input.value = ""; f.q = ""; clearBtn.hidden = true; syncURL(); renderResults(root); input.focus(); });
        $$("[data-filter]", root).forEach((s) => s.addEventListener("change", () => {
          f[s.dataset.filter] = s.value;
          s.classList.toggle("is-set", !!s.value && s.dataset.filter !== "sirala");
          syncURL(); renderResults(root);
        }));
        const temelBtn = $("[data-toggle=temel]", root);
        temelBtn.addEventListener("click", () => { f.temel = !f.temel; temelBtn.setAttribute("aria-pressed", String(f.temel)); syncURL(); renderResults(root); });
        const fb = $("[data-toggle-filters]", root), panel = $("#filters", root);
        fb.addEventListener("click", () => { const open = panel.classList.toggle("is-open"); fb.setAttribute("aria-expanded", String(open)); });
        $$("[data-view]", root).forEach((btn) => btn.addEventListener("click", () => {
          viewMode = btn.dataset.view; store.set(VIEW_KEY, viewMode);
          $$("[data-view]", root).forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
          renderResults(root);
        }));
        root.addEventListener("click", (e) => {
          const rm = e.target.closest("[data-remove]");
          if (!rm) return;
          const k = rm.dataset.remove;
          const keys = k === "*" ? Object.keys(f) : [k];
          for (const key of keys) {
            if (key === "sirala") { f.sirala = "kronolojik"; const s = $("#f-sirala", root); if (s) s.value = "kronolojik"; continue; }
            if (key === "temel") { f.temel = false; temelBtn.setAttribute("aria-pressed", "false"); continue; }
            if (key === "q") { f.q = ""; input.value = ""; clearBtn.hidden = true; continue; }
            f[key] = "";
            const s = $(`#f-${key}`, root);
            if (s) { s.value = ""; s.classList.remove("is-set"); }
          }
          syncURL(); renderResults(root);
        });
      }
    };
  }

  function viewBook(id) {
    const b = BOOK[id];
    if (!b) return viewNotFound();
    const a = AUTH[b.author];
    const l = LEVEL[b.level];
    const p = palette(b);
    const uncertain = /yaklaşık|tartışmalı|kesin değil|\?|sonra|yüzyıl/i.test(b.date) || /tartışmalı|kesin değil|bilinmez/i.test(b.dateNote || "");
    const prevs = (PREV[id] || []).map((x) => BOOK[x]).sort((x, y) => x.order - y.order).slice(0, 3);
    const nexts = b.next.map((x) => BOOK[x]);
    const before = BOOKS[b.order - 2], after = BOOKS[b.order];
    const others = booksOf(b.author).filter((x) => x.id !== id);
    const memberships = pathsOf(id);
    const neighbors = BOOKS.slice(Math.max(0, b.order - 3), Math.min(BOOKS.length, b.order + 2));

    // "Büyük yol": Homeros'tan Aristoteles'e ana çizgi; eserin kendi konumu vurgulanır
    const grand = [["ilyada", "İlyada"], ["odysseia", "Odysseia"], ["oresteia", "Tragedyalar"], ["herodotos", "Tarihçiler"], ["sokrates-savunmasi", "Sokrates"], ["devlet", "Platon"], ["nikomakhos-etik", "Aristoteles"], ["epikuros", "Helenistik felsefe"], ["plotinos", "Yeni Platonculuk"]];
    const grandIdx = (() => {
      const exact = grand.findIndex(([gid]) => gid === id);
      if (exact > -1) return exact;
      const at = (gid) => grand.findIndex(([x]) => x === gid);
      if (b.author === "platon") return at("devlet");
      if (b.author === "aristoteles") return at("nikomakhos-etik");
      if (b.categories.includes("tragedya") && b.period === "klasik") return at("oresteia");
      if (b.categories.includes("tarih") && b.year < -300) return at("herodotos");
      if (b.categories.includes("felsefe") && b.year > -330 && b.year < 250) return at("epikuros");
      let best = 0;
      grand.forEach(([gid], i) => { if (BOOK[gid].year <= b.year) best = i; });
      return best;
    })();

    const facts = [
      ["user", "Yazar", `<a href="#/kitaplar?yazar=${b.author}">${esc(a.name)}</a>`],
      ["calendar", "Yazılış tarihi", esc(b.date)],
      ["layers", "Antik dönem", `<a href="#/kitaplar?donem=${b.period}">${esc(PERIOD[b.period].name)}</a> <span style="opacity:.6">(${esc(PERIOD[b.period].range)})</span>`],
      ["feather", "Tür", esc(b.genre)],
      ["ruler", "Tahmini uzunluk", esc(b.length)],
      ["route", "Okuma seviyesi", `<a href="#/seviye/${b.level}">${esc(l.name)}</a> · Adım ${b.step}/${byLevel(b.level).length}`],
      ["clock", "Kronolojik sıra", `№ ${pad(b.order)} / ${BOOKS.length}`],
      ["bookmark", "Kategoriler", b.categories.map((c) => `<a href="#/kitaplar?kategori=${c}">${esc(CAT[c].name)}</a>`).join(", ")]
    ];

    const html = `
    <section class="detail-hero" style="--cover-bg:${p.bg}">
      <div class="container">
        <nav class="breadcrumb" aria-label="Konum"><a href="#/">Ana Sayfa</a>${icon("chevron-right")}<a href="#/seviye/${b.level}">${esc(l.name)}</a>${icon("chevron-right")}<span aria-current="page">${esc(b.title)}</span></nav>
        <div class="detail-hero__grid view-enter">
          <div class="detail-hero__cover">${cover(b, "lg")}</div>
          <div>
            <div class="detail-hero__badges">${levelChip(b.level)}${badge(b)}<span class="chip" style="background:rgba(255,255,255,.08);color:#ddd5c3">№ ${pad(b.order)} · ${esc(PERIOD[b.period].name)}</span></div>
            <h1>${esc(b.title)}</h1>
            <div class="detail-hero__original" lang="grc">${esc(b.original)}${b.subtitle ? ` · <span lang="tr">${esc(b.subtitle)}</span>` : ""}</div>
            <a class="detail-hero__author" href="#/kitaplar?yazar=${b.author}">${icon("user")}${esc(a.name)} <span style="font-weight:400;color:#a9a392;font-size:14px">(${esc(a.life)})</span></a>
            <p class="detail-hero__tagline">${esc(b.tagline)}</p>
            <dl class="facts">${facts.map(([ic, k, v]) => `<div class="fact"><dt>${icon(ic)}${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
            ${b.dateNote ? `<div class="date-note">${icon("info")}<div><b>${uncertain ? "Tarih notu — kesinlik düzeyi:" : "Tarih notu:"}</b> ${esc(b.dateNote)}</div></div>` : ""}
            <div class="detail-hero__row">
              <div class="rating-box">
                <div class="rating-box__top">${stars(b.stars)}${badge(b)}<a href="#/puanlama" style="font-size:12.5px;color:#a9a392;text-decoration:underline dotted">Puanlama nasıl yapılıyor?</a></div>
                ${K.rating.criteria.map((c) => `<div class="crit"><span>${esc(c.name)}</span><div class="progress"><div class="progress__bar" style="--p:${b.scores[c.id] * 20}%"></div></div><b>${b.scores[c.id]}/5</b></div>`).join("")}
              </div>
              <div class="read-box">${readToggle(b, "read-toggle--lg")}<p>Okuduğun eserleri işaretle; ilerlemen bu tarayıcıda saklanır.</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container detail-body">
        <div class="detail-main">
          <div class="dsec reveal">
            <h2><span class="dsec__icon">${motif(b.motif)}</span>Kısa Özet</h2>
            <span class="spoiler-free">${icon("eye")}Sürprizleri bozmadan</span>
            <div class="prose prose--dropcap">${b.summary.map((x) => `<p>${esc(x)}</p>`).join("")}</div>
          </div>
          <div class="dsec reveal">
            <h2><span class="dsec__icon">${motif("column")}</span>Neden Önemli?</h2>
            <div class="prose">${b.importance.map((x) => `<p>${esc(x)}</p>`).join("")}</div>
          </div>
          <div class="dsec reveal">
            <h2><span class="dsec__icon">${motif("laurel")}</span>Bu Kitabı Okuyunca Ne Kazanırım?</h2>
            <ul class="gains">${b.gains.map((g) => `<li><span class="tick">${icon("check")}</span><span>${esc(g)}</span></li>`).join("")}</ul>
          </div>
          <div class="dsec reveal">
            <h2><span class="dsec__icon">${motif("lamp")}</span>Okumadan Önce Bilinmesi Gerekenler</h2>
            <ol class="before">${b.before.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
            ${b.tip ? `<div class="tip" style="margin-top:22px">${motif("scroll")}<div><b>Okuma ipucu</b><p>${esc(b.tip)}</p></div></div>` : ""}
          </div>
          <div class="dsec reveal">
            <h2><span class="dsec__icon">${motif("compass")}</span>Bundan Sonra Ne Okunmalı?</h2>
            <div class="chain">
              <div class="chain__col"><span class="chain__label">${prevs.length ? "Öncesinde okunabilir" : "Başlangıç noktası"}</span>${prevs.length ? prevs.map((x) => mini(x)).join("") : `<p style="font-family:var(--font-serif);color:var(--muted);font-size:15px">Bu eser, okuma zincirinin ilk halkalarından biridir; önce okunması gereken bir eser yok.</p>`}</div>
              <div class="chain__arrow" aria-hidden="true">${icon("arrow-right")}</div>
              <div class="chain__current">${esc(b.title)}<small>Şu an buradasın</small></div>
              <div class="chain__arrow" aria-hidden="true">${icon("arrow-right")}</div>
              <div class="chain__col"><span class="chain__label">Sonra oku</span>${nexts.map((x) => mini(x)).join("")}</div>
            </div>
            <div class="grand-chain" aria-label="Antik Yunan okumasının ana çizgisi">
              <span style="font-size:11.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;margin-right:6px">Ana çizgi:</span>
              ${grand.map(([gid, label], i) => `${i ? icon("arrow-right") : ""}${i === grandIdx ? `<span class="cur" title="${esc(b.title)} bu aşamaya yakın">${esc(label)}</span>` : `<a href="#/kitap/${gid}">${esc(label)}</a>`}`).join("")}
            </div>
          </div>
          <nav class="detail-pager" aria-label="Kronolojik gezinme">
            ${before ? `<a class="pager-link" href="#/kitap/${before.id}"><small>${icon("arrow-left")}Kronolojik olarak önceki</small><b>${esc(before.title)}</b><span style="font-size:13px;color:var(--muted)">${esc(AUTH[before.author].name)} · ${esc(before.date)}</span></a>` : "<span></span>"}
            ${after ? `<a class="pager-link pager-link--next" href="#/kitap/${after.id}"><small>Kronolojik olarak sonraki${icon("arrow-right")}</small><b>${esc(after.title)}</b><span style="font-size:13px;color:var(--muted)">${esc(AUTH[after.author].name)} · ${esc(after.date)}</span></a>` : ""}
          </nav>
        </div>

        <aside class="aside">
          <div class="card aside-card author-box">
            <h3>${icon("user")}Yazar hakkında</h3>
            <div class="author-box__name">${esc(a.name)}</div>
            <div class="author-box__greek" lang="grc">${esc(a.greek)}</div>
            <dl><div><dt>Yaşamı</dt><dd>${esc(a.life)}</dd></div><div><dt>Nereli</dt><dd>${esc(a.origin)}</dd></div></dl>
            <p>${esc(a.bio)}</p>
            ${a.anatolia ? `<div class="anatolia">${icon("pin")}<div><b>Anadolu bağlantısı</b>${esc(a.anatolia)}</div></div>` : ""}
            ${others.length ? `<div style="margin-top:14px"><div class="chain__label" style="margin-bottom:8px">Yazarın diğer eserleri</div><div style="display:grid;gap:8px">${others.map((x) => mini(x)).join("")}</div></div>` : ""}
          </div>
          ${memberships.length ? `<div class="card aside-card"><h3>${icon("route")}Okuma yollarında</h3><div class="path-memberships">${memberships.map(({ path, index }) => {
            const pv = path.steps[index - 1], nx = path.steps[index + 1];
            return `<div class="pm"><div class="pm__head"><a href="#/okuma-yollari/${path.id}">${esc(path.short)}</a><span>Adım ${index + 1} / ${path.steps.length}</span></div>
              <div class="pm__nav">${pv ? `<a href="#/kitap/${pv.id}">${icon("arrow-left")}${esc(BOOK[pv.id].title)}</a>` : "<span>Yolun başı</span>"}${nx ? `<a href="#/kitap/${nx.id}">${esc(BOOK[nx.id].title)}${icon("arrow-right")}</a>` : "<span>Yolun sonu</span>"}</div></div>`;
          }).join("")}</div></div>` : ""}
          <div class="card aside-card"><h3>${icon("clock")}Zaman çizelgesindeki yeri</h3><div class="neighbors">${neighbors.map((x) => `<a class="neighbor${x.id === id ? " is-current" : ""}" href="#/kitap/${x.id}"${x.id === id ? ' aria-current="page"' : ""}><b>${pad(x.order)}</b><span>${esc(x.title)}<small>${esc(AUTH[x.author].name)} · ${esc(shortDate(x.date))}</small></span></a>`).join("")}</div>
            <a class="btn btn--outline btn--sm" style="margin-top:12px;width:100%" href="#/yol-haritasi">${icon("route")}Tüm zaman çizelgesi</a></div>
        </aside>
      </div>
    </section>`;
    return { title: `${b.title} (${a.name.replace(/[“”]/g, "")}) — Antik Yunan Klasikleri`, nav: "kitaplar", html };
  }

  function viewTimeline() {
    // Önce döneme, sonra yüzyıla göre grupla (MÖ 4. yüzyıl hem Klasik hem Helenistik dönemde yer alır)
    const groups = [];
    BOOKS.forEach((b) => {
      const c = centuryOf(b.year);
      let g = groups.find((x) => x.period === b.period && x.century === c);
      if (!g) { g = { period: b.period, century: c, books: [], events: [] }; groups.push(g); }
      g.books.push(b);
    });
    K.events.forEach((ev) => {
      const c = centuryOf(ev.year);
      const per = PERIODS.find((p) => ev.year >= p.from && ev.year < p.to) || PERIODS[PERIODS.length - 1];
      let g = groups.find((x) => x.century === c && x.period === per.id) || groups.find((x) => x.century === c);
      // O yüzyıla ait eser yoksa (ör. MÖ 31 Aktion) olay kendi yüzyıl başlığıyla gösterilir
      if (!g) { g = { period: per.id, century: c, books: [], events: [] }; groups.push(g); }
      g.events.push(ev);
    });
    const periodIndex = (id) => PERIODS.findIndex((p) => p.id === id);
    groups.sort((x, y) => x.century - y.century || periodIndex(x.period) - periodIndex(y.period));
    const anchorOf = (g) => `yy-${g.period}-${g.century < 0 ? "mo" + -g.century : "ms" + g.century}`;
    let lastPeriod = null;
    const body = groups.map((g) => {
      let out = "";
      if (g.period !== lastPeriod) {
        const per = PERIOD[g.period];
        out += `<div class="tl-period reveal"><div class="range">${esc(per.range)}</div><h3>${esc(per.name)}</h3><p>${esc(per.desc)}</p></div>`;
        lastPeriod = g.period;
      }
      const authors = [];
      g.books.forEach((b) => { if (!authors.includes(b.author)) authors.push(b.author); });
      out += `<div class="tl-century" id="${anchorOf(g)}">
        <div class="tl-century__label"><span>${centuryLabel(g.century)}</span></div>
        ${g.events.length ? `<div class="tl-events">${g.events.sort((x, y) => x.year - y.year).map((ev) => `<span class="tl-event"><b>${yearLabel(ev.year)}</b>${esc(ev.label)}</span>`).join("")}</div>` : ""}
        <div class="tl-authors">${authors.map((aid, i) => {
          const a = AUTH[aid];
          return `<div class="tl-author reveal" style="--pc:var(--p-${g.period});--d:${(i % 3) * 0.05}s"><div class="card tl-author__card">
            <div class="tl-author__head"><h3 class="tl-author__name">${esc(a.name)}</h3><span class="tl-author__life">${esc(a.life)}</span></div>
            <div class="tl-works">${g.books.filter((b) => b.author === aid).map((b) => `<a class="tl-work${read.has(b.id) ? " is-read" : ""}" data-book="${b.id}" href="#/kitap/${b.id}" style="${lvlVar(b.level)}">
              ${cover(b, "xs")}
              <span><span class="tl-work__t">${esc(b.title)}</span><br><span class="tl-work__d">№ ${pad(b.order)} · ${esc(b.date)}</span></span>
              <span class="tl-work__lvl" title="${esc(LEVEL[b.level].name)}"></span>
            </a>`).join("")}</div>
          </div></div>`;
        }).join("")}</div>
      </div>`;
      return out;
    }).join("");

    const jump = groups.map((g) => `<button type="button" data-scroll-to="${anchorOf(g)}">${centuryShort(g.century)}${g.period === "helenistik" && g.century === -4 ? " (Hel.)" : ""}</button>`).join("");

    const html = `${pageHero({
      eyebrow: "Kronolojik Yol Haritası",
      title: "Homeros'tan Plotinos'a",
      lead: "Antik Yunan edebiyatı ve düşüncesinin yaklaşık bin yıllık gelişimi: dönemler, yüzyıllar, yazarlar ve eserleri yazılış sırasıyla. Tarihlerin çoğu yaklaşıktır; her eserin sayfasında tarihleme notu bulunur.",
      motifName: "compass",
      crumbs: [["Yol Haritası", "#/yol-haritasi"]]
    })}
    <section class="section section--tight">
      <div class="container">
        <nav class="tl-jump" aria-label="Yüzyıla git">${jump}</nav>
        <div class="legend" style="margin-bottom:34px">
          <strong style="color:var(--ink-2)">Eser noktaları:</strong>
          ${LEVELS.map((l) => `<span><i style="--c:var(--lvl-${l.id})"></i>${esc(l.name)}</span>`).join("")}
          <span style="margin-left:auto">✓ = okuduğun eserler</span>
        </div>
        <div class="timeline">${body}</div>
        <div class="section-foot"><a class="btn btn--navy" href="#/okuma-yollari">${icon("route")}Önerilen okuma yollarını gör</a></div>
      </div>
    </section>`;
    return {
      title: "Kronolojik Yol Haritası — Antik Yunan Klasikleri",
      nav: "yol-haritasi",
      html
    };
  }

  function viewPaths(pid) {
    const path = PATH[pid] || PATHS[0];
    const scope = "path:" + path.id;
    const html = `${pageHero({
      eyebrow: "Önerilen Okuma Yolları",
      title: "Nereden başlayıp nereye gitmeli?",
      lead: "Bütün eserleri tek tek araştırmanıza gerek yok. Bu yollar, her eserin bir sonrakini anlamaya katkısı ve tarihsel gelişim gözetilerek hazırlandı. Her adımda o eserin neden orada olduğunu açıklıyoruz.",
      motifName: "olive",
      crumbs: [["Okuma Yolları", "#/okuma-yollari"]]
    })}
    <section class="section section--tight">
      <div class="container">
        <div class="path-tabs" role="tablist" aria-label="Okuma yolları">${PATHS.map((p) => `<a class="path-tab${p.id === path.id ? " is-active" : ""}" role="tab" aria-selected="${p.id === path.id}" href="#/okuma-yollari/${p.id}">${motif(p.motif)}${esc(p.short)}</a>`).join("")}</div>
        <div class="path-head">
          <div><div class="eyebrow">${path.steps.length} adımlık yol</div><h2>${esc(path.name)}</h2><p>${esc(path.desc)}</p></div>
          <div class="path-progress"><div class="path-progress__txt"><span>Yol ilerlemen</span><b>${progressText(scope)}</b></div>${progressBar(scope)}</div>
        </div>
        <ol class="steps">${path.steps.map((s, i) => {
          const b = BOOK[s.id];
          return `<li class="step reveal${read.has(b.id) ? " is-read" : ""}" data-book="${b.id}" style="--d:${Math.min(i, 6) * 0.04}s">
            <span class="step__num">${i + 1}</span>
            <div class="card step__card">
              <a href="#/kitap/${b.id}" aria-hidden="true" tabindex="-1">${cover(b, "sm")}</a>
              <div class="step__info">
                <a href="#/kitap/${b.id}"><h3 class="step__title">${esc(b.title)}</h3></a>
                <div class="step__meta"><span>${esc(AUTH[b.author].name)}</span><span>${esc(b.date)}</span>${levelChip(b.level)}${stars(b.stars)}</div>
                <p class="step__note"><b>Neden burada?</b>${esc(s.note)}</p>
              </div>
              <div class="step__actions">${readToggle(b)}<a class="btn btn--outline btn--sm" href="#/kitap/${b.id}">Ayrıntılar ${icon("arrow-right")}</a></div>
            </div>
          </li>`;
        }).join("")}</ol>
      </div>
    </section>
    <section class="section section--marble">
      <div class="container">
        <div class="section-head reveal"><div class="eyebrow">Tüm yollar</div><h2 class="section-title">Başka bir yolculuk seçin</h2></div>
        <div class="path-cards">${PATHS.map((p) => `<a class="card path-card reveal" href="#/okuma-yollari/${p.id}">
          ${motif(p.motif)}<h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>
          <div class="path-card__chain">${p.steps.map((s) => esc(BOOK[s.id].title)).join(" → ")}</div>
          <div style="display:grid;gap:6px"><div class="path-progress__txt" style="font-size:12.5px;color:var(--muted);display:flex;justify-content:space-between"><span>${p.steps.length} adım</span>${progressText("path:" + p.id)}</div>${progressBar("path:" + p.id)}</div>
        </a>`).join("")}</div>
      </div>
    </section>`;
    return { title: `${path.name} — Okuma Yolları`, nav: "okuma-yollari", html };
  }

  function viewCategories() {
    const html = `${pageHero({
      eyebrow: "Kategoriler ve Dönemler",
      title: "Konuya göre keşfedin",
      lead: "Eserler yalnızca seviyeye göre değil, türüne ve konusuna göre de sınıflandırıldı. Bir eser birden fazla kategoriye girebilir: İlyada hem epik edebiyat hem mitolojidir.",
      motifName: "amphora",
      crumbs: [["Kategoriler", "#/kategoriler"]]
    })}
    <section class="section section--tight"><div class="container">${categoryGrid(true)}</div></section>
    <section class="section section--marble">
      <div class="container">
        <div class="section-head reveal"><div class="eyebrow">Dönemler</div><h2 class="section-title">Antik Yunan'ın dört çağı</h2><p class="section-lead">Tarihçilerin kullandığı genel dönemlendirme. Sınırlar yaklaşıktır ve büyük siyasi olaylara göre çizilir.</p></div>
        <div class="period-cards">${PERIODS.map((p, i) => `<a class="card period-card reveal" style="--pc:var(--p-${p.id});--d:${i * 0.06}s" href="#/kitaplar?donem=${p.id}">
          <span class="range">${esc(p.range)}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><span class="count">${BOOKS.filter((b) => b.period === p.id).length} eser · ${progressText("period:" + p.id)} okundu</span>
        </a>`).join("")}</div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head reveal"><div class="eyebrow">Türler</div><h2 class="section-title">Edebî ve düşünsel türler</h2></div>
        <div style="display:flex;flex-wrap:wrap;gap:10px" class="reveal">${GENRES.filter(([k]) => BOOKS.some((b) => b.genreKey === k)).map(([k, n]) => `<a class="btn btn--outline" href="#/kitaplar?tur=${k}">${esc(n)} <span class="chip">${BOOKS.filter((b) => b.genreKey === k).length}</span></a>`).join("")}</div>
      </div>
    </section>`;
    return { title: "Kategoriler — Antik Yunan Klasikleri", nav: "kategoriler", html };
  }

  function viewMap() {
    const anatolian = Object.entries(AUTH).filter(([, a]) => a.anatolia);
    const html = `${pageHero({
      eyebrow: "Klasiklerin Haritası",
      title: "Yazarlar nerede yaşadı?",
      lead: "Antik Yunan dünyası bugünkü Yunanistan'dan çok daha genişti: Sicilya'dan Mısır'a, Anadolu kıyılarından Karadeniz'e uzanıyordu. Bir yere dokunarak orada doğan ya da çalışan yazarları görün.",
      motifName: "compass",
      crumbs: [["Harita", "#/harita"]]
    })}
    <section class="section section--tight"><div class="container">${mapHTML()}</div></section>
    <section class="section section--marble">
      <div class="container">
        <div class="section-head reveal"><div class="eyebrow">Anadolu bağlantısı</div><h2 class="section-title">Anadolu ve Ege adalarından sesler</h2><p class="section-lead">Felsefenin doğduğu Miletos'tan tarihin babasının şehri Bodrum'a: Antik Yunan klasiklerinin önemli bir bölümü bugünkü Türkiye topraklarında ya da hemen karşısındaki adalarda ortaya çıktı.</p></div>
        <div class="grid grid--3">${anatolian.map(([id, a], i) => `<div class="card info-card reveal" style="--d:${(i % 3) * 0.06}s">
          <h3 style="font-size:24px">${esc(a.name)}</h3>
          <p style="font-size:13.5px;color:var(--muted);font-family:var(--font-sans)">${esc(a.origin)}</p>
          <p>${esc(a.anatolia)}</p>
          <div style="display:grid;gap:8px;margin-top:12px">${booksOf(id).slice(0, 3).map((b) => mini(b)).join("")}</div>
        </div>`).join("")}</div>
      </div>
    </section>`;
    return { title: "Klasiklerin Haritası — Antik Yunan Klasikleri", nav: "harita", html, mount: mountMap };
  }

  function nextRecommendation() {
    const beginner = PATH["yeni-baslayanlar"].steps.map((s) => BOOK[s.id]).find((b) => !read.has(b.id));
    if (beginner) return { book: beginner, why: "Yeni başlayanlar yolundaki sıradaki adımın." };
    for (const l of LEVELS) {
      const b = byLevel(l.id).find((x) => !read.has(x.id));
      if (b) return { book: b, why: `${l.name} seviyesinde henüz okumadığın ilk eser (kronolojik sırayla).` };
    }
    return null;
  }

  function viewProgress() {
    const total = BOOKS.length, done = read.size, p = pct(done, total);
    const rec = nextRecommendation();
    const readList = BOOKS.filter((b) => read.has(b.id));
    const mustLeft = BOOKS.filter((b) => b.stars === 5 && !read.has(b.id));
    const html = `
    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Konum"><a href="#/">Ana Sayfa</a>${icon("chevron-right")}<span aria-current="page">İlerlemem</span></nav>
        <div class="progress-hero" style="margin-top:26px">
          <div class="big-ring" data-progress="all" style="--p:${p}"><div class="big-ring__txt"><b data-progress="all" data-format="pct">%${p}</b><span>tamamlandı</span></div></div>
          <div>
            <div class="eyebrow">Okuma İlerlemen</div>
            <h1 style="margin-top:10px">${done ? (done === total ? "Bütün yolu tamamladın!" : "Yolculuk sürüyor") : "Yolculuğun başındasın"}</h1>
            <p class="lead">${done ? `${total} eserin <b style="color:var(--gold-3)">${done}</b> tanesini okudun.` : "Henüz hiçbir eseri okundu olarak işaretlemedin. Bir eserin kartındaki “Okumadım” kutusuna tıklayarak başlayabilirsin."} İlerlemen yalnızca bu tarayıcıda saklanır.</p>
            <div class="stat-row">
              <div class="stat"><b>${done}</b><span>okunan eser</span></div>
              <div class="stat"><b>${total - done}</b><span>kalan eser</span></div>
              <div class="stat"><b>${countRead(scopeBooks("must"))}/${scopeBooks("must").length}</b><span>temel taş</span></div>
              <div class="stat"><b>${new Set(readList.map((b) => b.author)).size}</b><span>tanışılan yazar</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="meander meander--sm" aria-hidden="true"></div>
    </section>
    <section class="section section--tight">
      <div class="container">
        ${rec ? `<div class="card next-rec reveal">${cover(rec.book, "sm")}<div><div class="eyebrow">Sıradaki önerimiz</div><h3>${esc(rec.book.title)}</h3><p>${esc(AUTH[rec.book.author].name)} · ${esc(rec.book.date)} — ${esc(rec.why)} ${esc(rec.book.tagline)}</p><div class="data-actions"><a class="btn btn--navy" href="#/kitap/${rec.book.id}">Esere git ${icon("arrow-right")}</a>${readToggle(rec.book).replace('class="read-toggle ', 'style="width:auto" class="read-toggle ')}</div></div></div>` : `<div class="card next-rec reveal">${motif("laurel", "motif")}<div><h3>Tebrikler!</h3><p>Bu rehberdeki bütün eserleri okudun. Şimdi en sevdiklerine geri dönme zamanı olabilir.</p></div></div>`}
        <div class="grid grid--2" style="margin-top:28px">
          <div class="card info-card reveal"><h3>${motif("column")}Seviyelere göre</h3><div class="bars">${LEVELS.map((l) => `<div class="bar-row" style="--c:var(--lvl-${l.id})"><a href="#/seviye/${l.id}">${esc(l.name)}</a>${progressBar("level:" + l.id)}<b>${progressText("level:" + l.id)}</b></div>`).join("")}</div></div>
          <div class="card info-card reveal"><h3>${motif("compass")}Okuma yollarına göre</h3><div class="bars">${PATHS.map((x) => `<div class="bar-row"><a href="#/okuma-yollari/${x.id}">${esc(x.short)}</a>${progressBar("path:" + x.id)}<b>${progressText("path:" + x.id)}</b></div>`).join("")}</div></div>
          <div class="card info-card reveal"><h3>${motif("amphora")}Kategorilere göre</h3><div class="bars">${CATS.map((c) => `<div class="bar-row"><a href="#/kitaplar?kategori=${c.id}">${esc(c.name)}</a>${progressBar("cat:" + c.id)}<b>${progressText("cat:" + c.id)}</b></div>`).join("")}</div></div>
          <div class="card info-card reveal"><h3>${motif("temple")}Dönemlere göre</h3><div class="bars">${PERIODS.map((x) => `<div class="bar-row" style="--c:var(--p-${x.id})"><a href="#/kitaplar?donem=${x.id}">${esc(x.name)}</a>${progressBar("period:" + x.id)}<b>${progressText("period:" + x.id)}</b></div>`).join("")}</div>
            <div style="margin-top:22px"><h3 style="font-size:20px">${motif("scroll")}Verilerin</h3><p style="font-size:14.5px">İlerlemen tarayıcının yerel deposunda tutulur. Başka bir cihaza taşımak için dışa aktarıp orada içe aktarabilirsin.</p>
            <div class="data-actions" style="margin-top:12px"><button type="button" class="btn btn--outline btn--sm" data-export>${icon("download")}Dışa aktar</button><label class="btn btn--outline btn--sm" style="cursor:pointer">${icon("up")}İçe aktar<input type="file" accept="application/json,.json" data-import hidden></label><button type="button" class="btn btn--outline btn--sm" data-reset ${done ? "" : "disabled"}>${icon("trash")}Sıfırla</button></div></div>
          </div>
        </div>
      </div>
    </section>
    ${mustLeft.length ? `<section class="section section--marble"><div class="container"><div class="section-head reveal"><div class="eyebrow">Eksik temel taşlar</div><h2 class="section-title">Henüz okumadığın “Kesinlikle Oku” eserleri</h2></div><div class="grid grid--3">${mustLeft.map((b) => mini(b)).join("")}</div></div></section>` : ""}
    ${readList.length ? `<section class="section"><div class="container"><div class="section-head reveal"><div class="eyebrow">Kitaplığın</div><h2 class="section-title">Okuduğun eserler</h2></div><div class="grid grid--3">${readList.map((b) => mini(b)).join("")}</div></div></section>` : ""}`;
    return {
      title: "Okuma İlerlemem — Antik Yunan Klasikleri",
      nav: "",
      html,
      mount(root) {
        $("[data-export]", root).addEventListener("click", () => {
          const data = JSON.stringify({ uygulama: "antik-yunan-klasikleri", surum: 1, tarih: new Date().toISOString(), okunan: [...read] }, null, 2);
          const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
          const a = Object.assign(document.createElement("a"), { href: url, download: "antik-yunan-okuma-ilerlemesi.json" });
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          toast("İlerleme dosyası indirildi", "download");
        });
        $("[data-import]", root).addEventListener("change", async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          try {
            const obj = JSON.parse(await file.text());
            const ids = (Array.isArray(obj) ? obj : obj.okunan || []).filter((x) => BOOK[x]);
            ids.forEach((x) => read.add(x));
            saveRead(); refreshProgress();
            toast(`${ids.length} eser içe aktarıldı`, "check");
            render({ keepScroll: true });
          } catch {
            toast("Dosya okunamadı: geçerli bir ilerleme dosyası seçin", "info");
          }
        });
        $("[data-reset]", root).addEventListener("click", () => {
          if (!confirm("Bütün okuma ilerlemen silinecek. Emin misin?")) return;
          read.clear(); saveRead(); refreshProgress();
          toast("İlerleme sıfırlandı", "reset");
          render({ keepScroll: true });
        });
      }
    };
  }

  function viewGuide() {
    const html = `${pageHero({
      eyebrow: "Rehber",
      title: "Puanlama, seviyeler ve kaynaklar",
      lead: "Bu rehberin eserleri nasıl sıraladığını, yıldızların ve etiketlerin ne anlama geldiğini, tarihlerin nasıl verildiğini ve iyi bir okuma deneyimi için önerilerimizi burada bulabilirsiniz.",
      motifName: "scales",
      crumbs: [["Rehber", "#/puanlama"]]
    })}
    <section class="section section--dark">
      <div class="container">
        <div class="section-head reveal"><div class="eyebrow">Yıldız puanı</div><h2 class="section-title">Yıldızlar ve “Kesinlikle Oku” etiketi</h2><p class="section-lead">Yıldızlar kişisel beğeniyi değil, bir eserin Antik Yunan klasikleri arasındaki yerini gösterir.</p></div>
        ${ratingExplain()}
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="info-grid">
          <div class="card info-card reveal"><h3>${motif("column")}Seviyeler nasıl belirlendi?</h3>
            <p>Seviye bir eserin önemini değil, okunma zorluğunu gösterir. Belirlerken şunlara baktık:</p>
            <ul><li>Dilin ve anlatının erişilebilirliği (çeviride bile hissedilen yoğunluk)</li><li>Gerektirdiği ön bilgi: mitoloji, tarih ya da önceki filozoflar</li><li>Metnin bütünlüğü: fragman ya da ders notu niteliğindeki metinler daha zordur</li><li>Uzunluk ve teknik terim yoğunluğu</li></ul>
            <p>Bu yüzden Metafizik “Kesinlikle Oku” etiketli olduğu hâlde Uzman seviyesindedir; Enkheiridion ise Roma döneminden olmasına rağmen Başlangıç seviyesindedir.</p></div>
          <div class="card info-card reveal"><h3>${motif("compass")}Kronolojik sıra</h3>
            <p>Eserler yazılış (ya da ortaya çıkış) tarihlerine göre sıralanır ve her birine bir kronolojik numara (№) verilir. Tarihi aralık olarak verilen eserlerde sıralama için aralığın genel kabul gören noktası kullanılır.</p>
            <p>Seviye sayfalarındaki “Adım” numarası ise o seviyenin kendi içindeki önerilen sırayı gösterir. Önerilen okuma yolları da tarihsel gelişimi izler, ama gerektiğinde bir eserin bir sonrakini anlamaya katkısını öne alır.</p></div>
          <div class="card info-card reveal"><h3>${motif("scroll")}Tarihlendirme ve kaynaklar</h3>
            <p>Antik eserlerin çoğunun yazılış tarihi kesin olarak bilinmez. Bu rehberde tarihler, klasik filolojide yaygın kabul gören aralıklara göre verildi; tartışmalı durumlar eser sayfalarında ayrıca belirtildi. Ayrıntılı doğrulama için Oxford Classical Dictionary ve Cambridge History of Classical Literature gibi standart başvuru eserlerine bakılabilir.</p>
            <ul><li><b>Kesin tarihler</b> (ör. Oresteia, MÖ 458) antik sahneleme kayıtlarına dayanır.</li><li><b>“Yaklaşık”</b> ifadesi, araştırmacıların büyük ölçüde uzlaştığı bir aralığı belirtir.</li><li><b>“Tartışmalı”</b> ya da <b>“kesin değil”</b> ifadeleri, önemli görüş ayrılıkları olduğunu gösterir; ayrıntısı eser sayfasındaki tarih notundadır.</li></ul></div>
          <div class="card info-card reveal"><h3>${motif("lamp")}Çeviri seçerken</h3>
            <ul><li>Mümkünse doğrudan Antik Yunancadan yapılmış çevirileri tercih edin.</li><li>Açıklamalı (notlu) baskılar, özellikle tragedya, komedya ve Pindaros gibi göndermeli metinlerde büyük fark yaratır.</li><li>Giriş yazısı olan baskılar eserin bağlamını hızlıca kavramanızı sağlar.</li><li>Özel adların yazımı çeviriden çeviriye değişebilir (Aiskhylos / Eskilos, Thukydides / Tukididis); arama kutusu bu farklı yazımları tanır.</li></ul></div>
          <div class="card info-card reveal"><h3>${motif("owl")}Nasıl okumalı?</h3>
            <ul><li>Başlangıç seviyesinden ve tercihen İlyada'dan başlayın; sonraki yazarların neredeyse tamamı Homeros'a gönderme yapar.</li><li>Her eserin sayfasındaki “Okumadan önce bilinmesi gerekenler” bölümüne göz atın.</li><li>Tragedyaları okumadan önce ilgili mitin kısa özetini okumak deneyimi bozmaz, zenginleştirir.</li><li>Felsefi metinleri not alarak ve gerekirse ikinci kez okuyun.</li></ul></div>
          <div class="card info-card reveal"><h3>${motif("temple")}Bu site hakkında</h3>
            <p>Bu rehber, Antik Yunan klasiklerine ilgi duyan okurlar için hazırlanmış bağımsız bir okuma haritasıdır. Özetler, önem değerlendirmeleri ve puanlar editoryal niteliktedir.</p>
            <p>Okuma ilerlemeniz yalnızca tarayıcınızda (localStorage) saklanır. Hiçbir kişisel veri toplanmaz ve hiçbir sunucuya gönderilmez.</p></div>
        </div>
      </div>
    </section>`;
    return { title: "Rehber: Puanlama ve Kaynaklar — Antik Yunan Klasikleri", nav: "puanlama", html };
  }

  function viewNotFound() {
    return {
      title: "Sayfa bulunamadı — Antik Yunan Klasikleri",
      nav: "",
      html: `<section class="section"><div class="container"><div class="empty">${motif("labyrinth")}<h3>Bu sayfa labirentte kayboldu</h3><p>Aradığınız sayfa bulunamadı. Ariadne'nin ipini takip ederek ana sayfaya dönebilirsiniz.</p><div class="section-foot"><a class="btn btn--navy" href="#/">${icon("arrow-left")}Ana sayfaya dön</a></div></div></div></section>`
    };
  }

  /* ───────────── Yönlendirici ───────────── */
  const ROUTES = [
    [/^\/?$/, "home", viewHome],
    [/^\/seviyeler\/?$/, "seviyeler", viewLevels],
    [/^\/seviye\/([\w-]+)\/?$/, "seviye", viewLevel],
    [/^\/kitaplar\/?$/, "kitaplar", viewBooks],
    [/^\/kitap\/([\w-]+)\/?$/, "kitap", viewBook],
    [/^\/yol-haritasi\/?$/, "yol-haritasi", viewTimeline],
    [/^\/okuma-yollari(?:\/([\w-]+))?\/?$/, "okuma-yollari", viewPaths],
    [/^\/kategoriler\/?$/, "kategoriler", viewCategories],
    [/^\/harita\/?$/, "harita", viewMap],
    [/^\/ilerleme\/?$/, "ilerleme", viewProgress],
    [/^\/puanlama\/?$/, "puanlama", viewGuide]
  ];

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const isRouteHash = (h) => !h || h === "#" || h.startsWith("#/");

  function parseHash() {
    const raw = location.hash.replace(/^#/, "");
    const i = raw.indexOf("?");
    let path = i > -1 ? raw.slice(0, i) : raw;
    // Sorgu kısmını URLSearchParams kendisi çözer; yalnızca yol güvenli biçimde çözülür
    try { path = decodeURIComponent(path); } catch { /* bozuk yüzde kodlaması: olduğu gibi kullan */ }
    if (!path.startsWith("/")) path = "/";
    return { path, query: new URLSearchParams(i > -1 ? raw.slice(i + 1) : "") };
  }

  let revealObserver;
  function initReveal(root) {
    const els = $$(".reveal", root);
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    revealObserver?.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); revealObserver.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((el) => revealObserver.observe(el));
  }

  function render(opts = {}) {
    const { path, query } = parseHash();
    let view, name = "404";
    for (const [re, n, fn] of ROUTES) {
      const m = path.match(re);
      if (m) { view = fn(...m.slice(1), query); name = n; break; }
    }
    if (!view) view = viewNotFound();
    const main = $("#main");
    const y = window.scrollY;
    // Yeniden çizimde klavye odağını korumak için odaktaki "okundu" düğmesini ve sırasını hatırla
    const focusedBtn = opts.keepScroll ? document.activeElement?.closest?.("[data-toggle-read]") : null;
    const focusedToggle = focusedBtn?.dataset.toggleRead;
    const focusedIndex = focusedBtn ? $$("#main [data-toggle-read]").indexOf(focusedBtn) : -1;
    // Aynı sayfanın yeniden çizimi (okundu işareti, içe aktarma) giriş animasyonlarını tekrarlamaz
    main.innerHTML = `<div class="view ${opts.keepScroll ? "view--static" : "view-enter"}">${view.html}</div>`;
    const root = main.firstElementChild;
    document.title = view.title;
    $$(".nav a").forEach((a) => a.classList.toggle("is-active", !!view.nav && a.dataset.nav === view.nav));
    currentRoute = { name, refresh: view.refresh };
    view.mount?.(root);
    initReveal(root);
    refreshProgress();
    closeMenu();
    if (opts.keepScroll) window.scrollTo(0, y);
    else if (typeof opts.restore === "number") window.scrollTo(0, opts.restore);
    else window.scrollTo(0, 0);
    if (focusedBtn) {
      // Aynı düğme yoksa (ör. öneri kartı yeni esere geçtiyse) aynı sıradaki düğmeye odaklan
      const target = $(`[data-toggle-read="${focusedToggle}"]`, root) || $$("[data-toggle-read]", root)[focusedIndex];
      (target || $("#main")).focus({ preventScroll: true });
    }
  }

  function onHashChange() {
    // "#main" gibi sayfa içi çapalar bir sayfa değil: yönlendiriciye sokmadan hedefe git
    if (!isRouteHash(location.hash)) {
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* olduğu gibi */ }
      history.replaceState(history.state, "", lastHash || location.pathname + location.search);
      const target = document.getElementById(id);
      if (target) { target.focus?.({ preventScroll: true }); target.scrollIntoView(); }
      return;
    }
    if (searchOpen) closeSearch(false);
    scrollMemory.set(lastHash, window.scrollY);
    const restore = navByClick ? null : scrollMemory.get(location.hash) ?? null;
    navByClick = false;
    lastHash = location.hash;
    render({ restore });
    if (!restore) $("#main").focus({ preventScroll: true });
  }

  /* ───────────── Genel arayüz: menü, arama, kısayollar ───────────── */
  function syncScrollLock() { document.body.style.overflow = searchOpen || menuOpen ? "hidden" : ""; }

  function setMenu(open) {
    menuOpen = open;
    $("#mobile-nav").classList.toggle("is-open", open);
    const btn = $("[data-action=toggle-menu]");
    btn?.setAttribute("aria-expanded", String(open));
    btn?.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    syncScrollLock();
  }
  function closeMenu() { if (menuOpen) setMenu(false); }

  function openSearch() {
    const input = $("#search-input");
    if (searchOpen) { input.focus(); return; }
    closeMenu();
    searchReturnFocus = document.activeElement;
    const ov = $("#search");
    ov.hidden = false;
    void ov.offsetWidth; // görünür hâle geldikten sonra sınıf eklensin ki geçiş animasyonu çalışsın
    ov.classList.add("is-open");
    searchOpen = true;
    syncScrollLock();
    input.value = "";
    input.setAttribute("aria-expanded", "true");
    runSearch();
    input.focus();
  }
  function closeSearch(restoreFocus = true) {
    if (!searchOpen) return;
    const ov = $("#search");
    ov.classList.remove("is-open");
    searchOpen = false;
    $("#search-input").setAttribute("aria-expanded", "false");
    syncScrollLock();
    setTimeout(() => { if (!searchOpen) ov.hidden = true; }, 220);
    if (restoreFocus && searchReturnFocus?.isConnected) searchReturnFocus.focus({ preventScroll: true });
    searchReturnFocus = null;
  }
  function highlight(text, q) {
    const nt = norm(text), tokens = norm(q).split(" ").filter(Boolean);
    if (!tokens.length || nt.length !== text.length) return esc(text);
    const t = tokens.find((x) => nt.includes(x));
    if (!t) return esc(text);
    const i = nt.indexOf(t);
    return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + t.length)) + "</mark>" + esc(text.slice(i + t.length));
  }
  function runSearch() {
    const q = $("#search-input").value.trim();
    const box = $("#search-results");
    const hint = $("#search-hint"), more = $("#search-more");
    $("#search-all").href = "#/kitaplar" + (q ? "?q=" + encodeURIComponent(q) : "");
    const tokens = norm(q).split(" ").filter(Boolean);
    more.hidden = true;
    if (!tokens.length) {
      searchItems = PATH["yeni-baslayanlar"].steps.slice(0, 5).map((s) => BOOK[s.id]);
      hint.hidden = false;
      hint.innerHTML = `Başlamak için bir eser ya da yazar adı yazın. Farklı yazımlar da tanınır: <b>Eflatun</b>, <b>Aristo</b>, <b>Ezop</b>, <b>Tukididis</b>… Önerilen ilk adımlar:`;
      box.innerHTML = searchItems.map((b, i) => srItem(b, i, "")).join("");
    } else {
      const scored = BOOKS.map((b) => {
        if (!tokens.every((t) => b._all.includes(t))) return null;
        let s = 0;
        tokens.forEach((t) => {
          if (b._title.startsWith(t)) s += 6;
          else if (b._title.includes(t)) s += 4;
          if (b._author.includes(t)) s += 3;
        });
        return { b, s: s + b.stars * 0.1 };
      }).filter(Boolean).sort((x, y) => y.s - x.s || x.b.order - y.b.order);
      searchItems = scored.slice(0, 8).map((x) => x.b);
      box.innerHTML = searchItems.map((b, i) => srItem(b, i, q)).join("");
      hint.hidden = searchItems.length > 0;
      hint.textContent = `“${q}” için sonuç bulunamadı. Başka bir yazım deneyin (ör. “Oidipus” yerine “Oedipus”).`;
      if (scored.length > 8) {
        more.hidden = false;
        more.textContent = `ve ${scored.length - 8} sonuç daha — “Tüm eserlerde filtrele” bağlantısını kullanın.`;
      }
    }
    searchIndex = 0;
    markSearch();
  }
  function srItem(b, i, q) {
    return `<a class="sr" role="option" id="sr-${i}" aria-selected="false" href="#/kitap/${b.id}" data-sr="${i}">
      ${cover(b, "xs")}
      <span><span class="sr__t">${highlight(b.title, q)}</span><br><span class="sr__m">${highlight(AUTH[b.author].name, q)} · ${esc(b.date)} · ${esc(LEVEL[b.level].short)}</span></span>
      ${stars(b.stars, false)}
    </a>`;
  }
  function markSearch() {
    $$("#search-results .sr").forEach((el, i) => el.setAttribute("aria-selected", String(i === searchIndex)));
    const cur = $(`#sr-${searchIndex}`);
    $("#search-input").setAttribute("aria-activedescendant", cur ? cur.id : "");
    cur?.scrollIntoView({ block: "nearest" });
  }

  function bindGlobal() {
    document.addEventListener("click", (e) => {
      const t = e.target;
      const toggle = t.closest("[data-toggle-read]");
      if (toggle) { e.preventDefault(); toggleRead(toggle.dataset.toggleRead); return; }
      const action = t.closest("[data-action]");
      if (action) {
        const a = action.dataset.action;
        if (a === "open-search") openSearch();
        if (a === "toggle-menu") setMenu(!menuOpen);
        if (a === "to-top") window.scrollTo({ top: 0, behavior: scrollBehavior() });
        return;
      }
      // "İçeriğe geç" bağlantısı: adres değiştirmeden ana içeriğe odaklan
      if (t.closest('a[href="#main"]')) {
        e.preventDefault();
        $("#main").focus();
        return;
      }
      const scrollTo = t.closest("[data-scroll-to]");
      if (scrollTo) {
        e.preventDefault();
        const target = document.getElementById(scrollTo.dataset.scrollTo);
        if (target) {
          // Yapışkan başlık ve yüzyıl çubuğu hedefin üstünü örtmesin
          const offset = $(".site-header").offsetHeight + (scrollTo.closest(".tl-jump")?.offsetHeight || 0) + 12;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: scrollBehavior() });
        }
        return;
      }
      const link = t.closest('a[href^="#/"]');
      if (link) {
        // Yeni sekmede açma (Ctrl/Cmd/Shift + tık) mevcut sayfayı değiştirmez
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (searchOpen) closeSearch(false);
        if (link.getAttribute("href") === location.hash || (link.getAttribute("href") === "#/" && !location.hash)) {
          e.preventDefault();
          closeMenu();
          window.scrollTo({ top: 0, behavior: scrollBehavior() });
        } else {
          navByClick = true;
        }
        return;
      }
      if (searchOpen && t === $("#search")) closeSearch();
    });

    $("#search-input").addEventListener("input", runSearch);
    $("#search-input").addEventListener("keydown", (e) => {
      if (!searchItems.length) return;
      if (e.key === "ArrowDown") { e.preventDefault(); searchIndex = Math.min(searchIndex + 1, searchItems.length - 1); markSearch(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); searchIndex = Math.max(searchIndex - 1, 0); markSearch(); }
      else if (e.key === "Enter") {
        e.preventDefault();
        const b = searchItems[searchIndex];
        if (!b) return;
        closeSearch(false);
        if (location.hash === "#/kitap/" + b.id) window.scrollTo({ top: 0, behavior: scrollBehavior() });
        else { navByClick = true; location.hash = "#/kitap/" + b.id; }
      }
    });
    // Arama penceresi açıkken Tab odağı pencere içinde döner
    $("#search").addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const items = $$("#search input, #search a[href]").filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    document.addEventListener("keydown", (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if (e.key === "Escape") {
        if (searchOpen) closeSearch();
        closeMenu();
      } else if (!typing && (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"))) {
        e.preventDefault();
        openSearch();
      }
    });

    // Masaüstü genişliğine geçildiğinde açık kalan mobil menüyü kapat
    window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => { if (e.matches) closeMenu(); });

    const toTop = $(".to-top");
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { toTop.classList.toggle("is-show", window.scrollY > 900); ticking = false; });
    }, { passive: true });

    window.addEventListener("hashchange", onHashChange);

    // Başka bir sekmede yapılan işaretlemeleri eşitle
    window.addEventListener("storage", (e) => {
      if (e.key !== STORE_KEY) return;
      read.clear();
      (store.get(STORE_KEY, []) || []).filter((id) => BOOK[id]).forEach((id) => read.add(id));
      render({ keepScroll: true });
    });
  }

  function init() {
    $("#footer-levels").innerHTML = LEVELS.map((l) => `<li><a href="#/seviye/${l.id}">${esc(l.numeral)}. ${esc(l.name)}</a></li>`).join("");
    bindGlobal();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
