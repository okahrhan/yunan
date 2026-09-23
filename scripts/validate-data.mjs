// Veri tutarlılığını denetler: benzersiz id'ler, zorunlu alanlar, geçerli seviye/dönem/kategori
// başvuruları, "next" ve okuma yolu bağlantıları, puan aralıkları ve dönem–yıl uyumu.
// Kullanım: node scripts/validate-data.mjs  (hata varsa çıkış kodu 1)
import { readFileSync } from "node:fs";
import vm from "node:vm";

const FILES = [
  "js/data/meta.js",
  "js/data/authors.js",
  "js/data/books-1-arkaik.js",
  "js/data/books-2-klasik-edebiyat.js",
  "js/data/books-3-klasik-felsefe.js",
  "js/data/books-4-helenistik-roma.js",
  "js/data/paths.js",
  "js/data/map.js"
];

const ctx = { window: {} };
vm.createContext(ctx);
for (const f of FILES) vm.runInContext(readFileSync(new URL(`../${f}`, import.meta.url), "utf8"), ctx, { filename: f });
const K = ctx.window.KLASIK;

const errors = [];
const warn = [];
const err = (m) => errors.push(m);

const levels = new Set(K.levels.map((l) => l.id));
const periods = new Map(K.periods.map((p) => [p.id, p]));
const cats = new Set(K.categories.map((c) => c.id));
const places = new Set(K.map.places.map((p) => p.id));
const ids = new Set();
const REQUIRED = ["id", "title", "original", "author", "date", "year", "period", "genre", "categories", "level", "length", "scores", "motif", "tagline", "summary", "importance", "gains", "before", "next"];
// icons.js'i sahte bir document ile çalıştırıp tanımlı motif adlarını al
const iconCtx = { window: { KLASIK: {} }, document: { body: { insertAdjacentHTML() {} } } };
vm.createContext(iconCtx);
vm.runInContext(readFileSync(new URL("../js/icons.js", import.meta.url), "utf8"), iconCtx);
const MOTIFS = new Set(iconCtx.window.KLASIK.motifs);

for (const b of K.books) {
  for (const k of REQUIRED) if (b[k] === undefined || b[k] === "") err(`${b.id ?? "?"}: '${k}' alanı eksik`);
  if (ids.has(b.id)) err(`${b.id}: yinelenen id`);
  ids.add(b.id);
  if (!/^[a-z0-9-]+$/.test(b.id)) err(`${b.id}: id yalnızca küçük harf, rakam ve tire içermeli`);
  if (!K.authors[b.author]) err(`${b.id}: bilinmeyen yazar '${b.author}'`);
  if (!levels.has(b.level)) err(`${b.id}: bilinmeyen seviye '${b.level}'`);
  if (!periods.has(b.period)) err(`${b.id}: bilinmeyen dönem '${b.period}'`);
  for (const c of b.categories ?? []) if (!cats.has(c)) err(`${b.id}: bilinmeyen kategori '${c}'`);
  for (const s of ["tarih", "edebi", "etki"]) {
    const v = b.scores?.[s];
    if (!Number.isInteger(v) || v < 1 || v > 5) err(`${b.id}: scores.${s} 1–5 arası tam sayı olmalı`);
  }
  if (!Number.isFinite(b.year) || b.year === 0) err(`${b.id}: year sıfırdan farklı bir sayı olmalı (MÖ için negatif)`);
  const p = periods.get(b.period);
  if (p && (b.year < p.from - 60 || b.year > p.to + 5)) warn.push(`${b.id}: yıl (${b.year}) '${p.name}' aralığının dışında görünüyor`);
  if (MOTIFS.size && !MOTIFS.has(b.motif)) err(`${b.id}: icons.js içinde tanımlı olmayan motif '${b.motif}'`);
  for (const k of ["summary", "importance", "gains", "before", "alt"]) if (b[k] && !Array.isArray(b[k])) err(`${b.id}: '${k}' bir dizi olmalı`);
  if (b.next?.includes(b.id)) err(`${b.id}: kendisini 'next' içinde öneriyor`);
}

for (const b of K.books) for (const n of b.next ?? []) if (!ids.has(n)) err(`${b.id}: 'next' içindeki '${n}' bulunamadı`);

for (const path of K.paths) {
  const seen = new Set();
  for (const s of path.steps) {
    if (!ids.has(s.id)) err(`yol '${path.id}': '${s.id}' bulunamadı`);
    if (seen.has(s.id)) err(`yol '${path.id}': '${s.id}' iki kez geçiyor`);
    if (!s.note) err(`yol '${path.id}': '${s.id}' adımında açıklama (note) yok`);
    seen.add(s.id);
  }
}

for (const [id, a] of Object.entries(K.authors)) {
  for (const pl of a.places ?? []) if (!places.has(pl)) err(`yazar '${id}': haritada olmayan yer '${pl}'`);
  if (![...K.books].some((b) => b.author === id)) warn.push(`yazar '${id}': hiçbir esere bağlı değil`);
}
for (const [pl, n] of Object.entries(K.placeNotes)) {
  if (!places.has(pl)) err(`placeNotes: haritada olmayan yer '${pl}'`);
  for (const bid of n.books) if (!ids.has(bid)) err(`placeNotes '${pl}': '${bid}' bulunamadı`);
}

const years = new Map();
for (const b of K.books) {
  if (years.has(b.year)) warn.push(`${b.id} ile ${years.get(b.year)} aynı sıralama yılına (${b.year}) sahip; sıra başlığa göre belirlenir`);
  years.set(b.year, b.id);
}

const byLevel = {};
for (const b of K.books) byLevel[b.level] = (byLevel[b.level] ?? 0) + 1;
const stars = {};
for (const b of K.books) {
  const s = Math.round((b.scores.tarih + b.scores.edebi + b.scores.etki) / 3);
  stars[s] = (stars[s] ?? 0) + 1;
}

console.log(`${K.books.length} eser, ${Object.keys(K.authors).length} yazar, ${K.paths.length} okuma yolu`);
console.log("Seviyelere göre:", byLevel);
console.log("Yıldızlara göre:", stars);
for (const w of warn) console.log("uyarı:", w);
if (errors.length) {
  for (const e of errors) console.error("HATA:", e);
  process.exit(1);
}
console.log("Veri geçerli ✓");
