// Antik Yunan dünyası haritasını (kıyı çizgileri + şehirler) statik SVG verisine dönüştürür.
// Kaynak: Natural Earth (world-atlas paketi, kamu malı). Çıktı: js/data/map.js
// Kullanım: npm install && npm run build:map
import { readFileSync, writeFileSync } from "node:fs";
import { geoMercator, geoPath, geoClipRectangle } from "d3-geo";
import { feature } from "topojson-client";

const WIDTH = 1000;
const HEIGHT = 620;
const BOUNDS = { west: 11.2, east: 39.4, south: 30.2, north: 42.6 };

const topo = JSON.parse(readFileSync(new URL("../node_modules/world-atlas/land-50m.json", import.meta.url)));
const land = feature(topo, topo.objects.land);

const frame = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [[
      // d3-geo'da dış halka saat yönünde olmalı
      [BOUNDS.west, BOUNDS.south], [BOUNDS.west, BOUNDS.north],
      [BOUNDS.east, BOUNDS.north], [BOUNDS.east, BOUNDS.south], [BOUNDS.west, BOUNDS.south]
    ]]
  }
};

const projection = geoMercator().fitSize([WIDTH, HEIGHT], frame);
const [x0, y0] = projection([BOUNDS.west, BOUNDS.north]);
const [x1, y1] = projection([BOUNDS.east, BOUNDS.south]);
const clipped = geoPath(projection.postclip(geoClipRectangle(x0, y0, x1, y1))).digits(1);
const landPath = clipped(land);

// Şehirler: [id, antik ad, günümüzdeki ad, boylam, enlem, tür, etiket yönü]
const PLACES = [
  ["atina", "Atina", "Atina", 23.73, 37.98, "author", "e"],
  ["eleusis", "Eleusis", "Elefsina", 23.54, 38.04, "author", "w"],
  ["thebai", "Thebai", "Thiva", 23.32, 38.32, "author", "n"],
  ["askra", "Askra", "Boiotia", 23.02, 38.36, "author", "w"],
  ["khaironeia", "Khaironeia", "Boiotia", 22.84, 38.50, "author", "nw"],
  ["delphoi", "Delphoi", "Delfi", 22.50, 38.48, "landmark", "w"],
  ["korinthos", "Korinthos", "Korint", 22.93, 37.91, "landmark", "w"],
  ["olympia", "Olympia", "Olimbia", 21.63, 37.64, "landmark", "w"],
  ["sparta", "Sparta", "Sparti", 22.43, 37.07, "landmark", "w"],
  ["megalopolis", "Megalopolis", "Arkadia", 22.13, 37.40, "author", "w"],
  ["stageira", "Stageira", "Halkidiki", 23.75, 40.53, "author", "n"],
  ["troia", "Troia", "Hisarlık, Çanakkale", 26.24, 39.96, "landmark", "n"],
  ["lampsakos", "Lampsakos", "Lapseki", 26.69, 40.35, "author", "e"],
  ["assos", "Assos", "Behramkale", 26.34, 39.49, "author", "e"],
  ["mytilene", "Mytilene", "Midilli", 26.55, 39.11, "author", "e"],
  ["eresos", "Eresos", "Midilli", 25.93, 39.17, "author", "w"],
  ["kyme", "Kyme", "Aliağa", 27.03, 38.76, "author", "e"],
  ["smyrna", "Smyrna", "İzmir", 27.14, 38.42, "author", "e"],
  ["khios", "Khios", "Sakız Adası", 26.13, 38.37, "author", "w"],
  ["ephesos", "Ephesos", "Selçuk", 27.34, 37.94, "author", "e"],
  ["samos", "Samos", "Sisam", 26.97, 37.69, "author", "w"],
  ["miletos", "Miletos", "Balat, Didim", 27.28, 37.53, "author", "e"],
  ["halikarnassos", "Halikarnassos", "Bodrum", 27.42, 37.04, "author", "e"],
  ["kos", "Kos", "İstanköy", 27.09, 36.85, "author", "sw"],
  ["hierapolis", "Hierapolis", "Pamukkale", 29.13, 37.93, "author", "e"],
  ["samosata", "Samosata", "Samsat, Adıyaman", 38.53, 37.58, "author", "w"],
  ["knossos", "Knossos", "Girit", 25.16, 35.30, "landmark", "s"],
  ["iskenderiye", "İskenderiye", "İskenderiye", 29.92, 31.20, "author", "e"],
  ["syrakusai", "Syrakusai", "Siraküza", 15.29, 37.07, "author", "e"],
  ["leontinoi", "Leontinoi", "Lentini", 15.00, 37.29, "author", "n"],
  ["elea", "Elea", "Velia", 15.15, 40.16, "author", "e"],
  ["roma", "Roma", "Roma", 12.50, 41.90, "author", "e"],
  ["nikopolis", "Nikopolis", "Preveze", 20.73, 39.01, "author", "w"]
];

const places = PLACES.map(([id, name, modern, lon, lat, kind, anchor]) => {
  const [x, y] = projection([lon, lat]);
  return { id, name, modern, x: +x.toFixed(1), y: +y.toFixed(1), kind, anchor };
});

// Meridyen / paralel çizgileri (dekoratif ızgara)
const grid = [];
for (let lon = 12; lon <= 39; lon += 3) {
  const [ax, ay] = projection([lon, BOUNDS.north]);
  const [bx, by] = projection([lon, BOUNDS.south]);
  grid.push(`M${ax.toFixed(1)},${ay.toFixed(1)}L${bx.toFixed(1)},${by.toFixed(1)}`);
}
for (let lat = 31; lat <= 42; lat += 2) {
  const [ax, ay] = projection([BOUNDS.west, lat]);
  const [bx, by] = projection([BOUNDS.east, lat]);
  grid.push(`M${ax.toFixed(1)},${ay.toFixed(1)}L${bx.toFixed(1)},${by.toFixed(1)}`);
}

// Deniz adları ve pusula gülünün konumu
const seas = [
  ["Ege Denizi", 25.1, 36.05],
  ["Akdeniz", 22.5, 34.1],
  ["İyon Denizi", 19.2, 36.3],
  ["Karadeniz", 33.5, 42.05]
].map(([name, lon, lat]) => {
  const [x, y] = projection([lon, lat]);
  return { name, x: +x.toFixed(1), y: +y.toFixed(1) };
});
const [cx, cy] = projection([14.3, 33.9]);
const compass = { x: +cx.toFixed(1), y: +cy.toFixed(1) };

const out = `/* Otomatik üretildi: scripts/build-map.mjs — elle düzenlemeyin.
   Kıyı çizgileri: Natural Earth 1:50m (kamu malı), world-atlas paketi üzerinden. */
window.KLASIK = window.KLASIK || {};
window.KLASIK.map = ${JSON.stringify({ width: WIDTH, height: HEIGHT, land: landPath, grid: grid.join(""), places, seas, compass })};
`;
writeFileSync(new URL("../js/data/map.js", import.meta.url), out);
console.log(`map.js yazıldı: ${(out.length / 1024).toFixed(1)} KB, ${places.length} yer`);
