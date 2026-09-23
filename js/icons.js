/* SVG sembol kütüphanesi: eser kapaklarındaki motifler (m-*) ve arayüz simgeleri (i-*).
   Sayfa yüklenirken tek bir gizli <svg> olarak belgeye eklenir; <use href="#m-owl"> ile kullanılır. */
(function () {
  "use strict";

  // Yaprak/tane gibi tekrar eden biçimleri bir eğri boyunca yerleştiren küçük yardımcılar
  const leaf = (x, y, rot, len = 9, w = 3.2) =>
    `<path transform="translate(${x} ${y}) rotate(${rot})" d="M0 0C${-w} ${-len * 0.3} ${-w} ${-len * 0.75} 0 ${-len}C${w} ${-len * 0.75} ${w} ${-len * 0.3} 0 0Z"/>`;
  const grain = (x, y, rot) => leaf(x, y, rot, 7, 2.6);

  // Kübik Bézier üzerinde nokta ve yaprak yönü (0° = yukarı bakan yaprak)
  function bezier(p, t) {
    const m = 1 - t;
    const x = m * m * m * p[0] + 3 * m * m * t * p[2] + 3 * m * t * t * p[4] + t * t * t * p[6];
    const y = m * m * m * p[1] + 3 * m * m * t * p[3] + 3 * m * t * t * p[5] + t * t * t * p[7];
    const dx = 3 * m * m * (p[2] - p[0]) + 6 * m * t * (p[4] - p[2]) + 3 * t * t * (p[6] - p[4]);
    const dy = 3 * m * m * (p[3] - p[1]) + 6 * m * t * (p[5] - p[3]) + 3 * t * t * (p[7] - p[5]);
    return [x, y, (Math.atan2(dx, -dy) * 180) / Math.PI];
  }

  function laurel() {
    const stem = [30, 56, 16, 51, 9, 38, 14, 16];
    let s = "";
    for (const side of [1, -1]) {
      const pts = side === 1 ? stem : stem.map((v, i) => (i % 2 ? v : 64 - v));
      s += `<path d="M${pts[0]} ${pts[1]}C${pts[2]} ${pts[3]} ${pts[4]} ${pts[5]} ${pts[6]} ${pts[7]}"/>`;
      for (const t of [0.18, 0.36, 0.54, 0.72, 0.9]) {
        const [x, y, a] = bezier(pts, t);
        s += leaf(x.toFixed(1), y.toFixed(1), (a - 38 * side).toFixed(0), 8.5, 3);
        s += leaf(x.toFixed(1), y.toFixed(1), (a + 30 * side).toFixed(0), 7.5, 2.7);
      }
      const [x, y, a] = bezier(pts, 1);
      s += leaf(x.toFixed(1), y.toFixed(1), a.toFixed(0), 8, 2.8);
    }
    return s + `<path d="M26 58l6-4 6 4"/>`;
  }

  function olive() {
    let s = `<path d="M10 56C22 44 34 30 54 10"/>`;
    const pts = [[16, 50, -80], [22, 44, 10], [27, 38, -75], [33, 32, 12], [38, 26, -70], [44, 20, 15], [49, 15, -60]];
    for (const [x, y, r] of pts) s += leaf(x, y, r + 20, 12, 2.8);
    s += `<ellipse cx="24" cy="50" rx="2.6" ry="3.4" transform="rotate(-30 24 50)" class="fill"/><ellipse cx="41" cy="33" rx="2.6" ry="3.4" transform="rotate(-30 41 33)" class="fill"/>`;
    return s;
  }

  function wheat() {
    const stalk = (dx, rot) => {
      let s = `<g transform="rotate(${rot} 32 58)"><path d="M32 58V14"/>`;
      for (let i = 0; i < 5; i++) {
        const y = 17 + i * 6;
        s += grain(32, y + 1, -28) + grain(32, y + 1, 28);
      }
      return s + grain(32, 15, 0) + `</g>`;
    };
    return stalk(0, -16) + stalk(0, 16) + stalk(0, 0) + `<path d="M24 50c4 2 12 2 16 0"/>`;
  }

  function grapes() {
    let s = `<path d="M32 16V8c0-2 1.5-3 3.5-3"/><path d="M32 12c-3-4-9-5-13-2 1 4 5 6 9 5M32 12c3-4 9-5 13-2-1 4-5 6-9 5" /><path d="M45 10c3 0 5 2 4.5 5-.3 1.8-2 2.3-3 1.2" class="thin"/>`;
    const rows = [[4, 21], [3, 28], [4, 35], [3, 42], [2, 49], [1, 56]];
    for (const [n, y] of rows) for (let i = 0; i < n; i++) s += `<circle cx="${32 + (i - (n - 1) / 2) * 7}" cy="${y}" r="3.4"/>`;
    return s;
  }

  const MOTIFS = {
    helmet: `<path d="M15 27C15 16 22 9 32 9s17 7 17 18v13c0 6-3 11-8 14l-3 2V44l4-3v-6c0-3-2-5-5-5h-2v18l-3 3-3-3V30h-2c-3 0-5 2-5 5v6l4 3v12l-3-2c-5-3-8-8-8-14z"/><path d="M16 17C19 7 45 7 48 17"/><path d="M20 12c6-6 18-6 24 0"/><path d="M22 23c6-3 14-3 20 0"/>`,
    ship: `<path d="M5 40h54l-6 9H12z"/><path d="M59 40c3-2 4-7 1-10"/><path d="M5 40c-2-2-2-5 0-7"/><path d="M32 40V10"/><path d="M19 13c9 2 17 2 26 0v19c-9 2-17 2-26 0z"/><path d="M25.5 14.2v19M38.5 14.2v19" class="thin"/><path d="M14 49l-4 7M21 49l-4 7M28 49l-4 7M35 49l-4 7M42 49l-4 7M49 49l-4 7"/><circle cx="10.5" cy="44" r="1.3" class="fill"/>`,
    amphora: `<path d="M26.5 7h11"/><path d="M28 7v6c0 3-9 6-9 17 0 9 5 16 9 20l1 4h6l1-4c4-4 9-11 9-20 0-11-9-14-9-17V7"/><path d="M28 12c-5-1-9 2-8.5 8.5M36 12c5-1 9 2 8.5 8.5"/><path d="M29 54h6M26.5 57.5h11"/><path d="M19.6 28h24.8M20 36h24"/><path d="M21 34l2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3" class="thin"/>`,
    owl: `<path d="M20 22c0-7 5-11 12-11s12 4 12 11v12c0 9-5 15-12 15s-12-6-12-15z"/><path d="M20.5 18L18 10l7 4.5M43.5 18L46 10l-7 4.5"/><circle cx="26.5" cy="24" r="4.6"/><circle cx="37.5" cy="24" r="4.6"/><circle cx="26.5" cy="24" r="1.6" class="fill"/><circle cx="37.5" cy="24" r="1.6" class="fill"/><path d="M32 27.5l-2 3.2h4z" class="fill"/><path d="M22.5 33c2 6 5 10 9.5 11M41.5 33c-2 6-5 10-9.5 11"/><path d="M29 36l1.5 1.5L32 36l1.5 1.5L35 36M30 40l2 1.5 2-1.5" class="thin"/><path d="M14 52h36"/><path d="M27 49v3.5M29.5 49v3.5M34.5 49v3.5M37 49v3.5"/>${leaf(47, 52, 60, 8, 2.6)}${leaf(17, 52, -60, 8, 2.6)}`,
    "mask-tragic": `<path d="M18 12c5-2.5 23-2.5 28 0 0 15-2 26-7 33-3 5-11 5-14 0-5-7-7-18-7-33z"/><path d="M21.5 25c3-3.5 6.5-3 8.5-.5M42.5 25c-3-3.5-6.5-3-8.5-.5"/><path d="M22 30c2.5-2 5-2 7.5 0-2.5 2-5 2-7.5 0zM34.5 30c2.5-2 5-2 7.5 0-2.5 2-5 2-7.5 0z"/><path d="M26 45c2-4.5 10-4.5 12 0-3-1.2-9-1.2-12 0z"/><path d="M32 30v8"/><path d="M18 13c-5 2-7 7-6 12M46 13c5 2 7 7 6 12" class="thin"/><path d="M25 35c-1 2-1 4 0 6M39 35c1 2 1 4 0 6" class="thin"/>`,
    "mask-comic": `<path d="M17 13c5-2.5 25-2.5 30 0 0 14-2 24-7 31-4 5-12 5-16 0-5-7-7-17-7-31z"/><path d="M20.5 24c3-4.5 7-4.5 9.5-1M43.5 24c-3-4.5-7-4.5-9.5-1"/><path d="M22 30c2.5 2.2 5 2.2 7.5 0M34.5 30c2.5 2.2 5 2.2 7.5 0"/><path d="M24 38c3 8 13 8 16 0z"/><path d="M32 29v6" class="thin"/><circle cx="21.5" cy="36" r="2" class="thin"/><circle cx="42.5" cy="36" r="2" class="thin"/><path d="M17 14c-5 2-7 7-6 12M47 14c5 2 7 7 6 12" class="thin"/>`,
    lyre: `<path d="M24 42C18 33 15 22 19.5 12.5c1.2-2.5 4-2.3 4.8.3M40 42c6-9 9-20 4.5-29.5-1.2-2.5-4-2.3-4.8.3"/><path d="M17 17h30"/><path d="M19 43c0 9 26 9 26 0 0-4.5-26-4.5-26 0z"/><path d="M27 17v27M30.3 17v28M33.7 17v28M37 17v27" class="thin"/><path d="M25.5 47h13"/>`,
    column: `<path d="M13 9h38"/><path d="M17 12h30"/><circle cx="17.5" cy="17" r="5"/><circle cx="17.5" cy="17" r="1.7"/><circle cx="46.5" cy="17" r="5"/><circle cx="46.5" cy="17" r="1.7"/><path d="M22.5 17c5 3 14 3 19 0"/><path d="M22 22v30M42 22v30"/><path d="M27 23v29M32 23v29M37 23v29" class="thin"/><path d="M19 52h26M17 55.5h30M15 59h34"/>`,
    laurel: laurel(),
    scroll: `<path d="M14 10.5h33a3.2 3.2 0 0 1 0 6.4H14a3.2 3.2 0 0 1 0-6.4z"/><path d="M17 16.9v32.6M44 16.9v32.6"/><path d="M17 49.5h33a3.2 3.2 0 0 1 0 6.4H17a3.2 3.2 0 0 1 0-6.4z"/><path d="M22 23h17M22 28h17M22 33h12M22 38h17M22 43h9" class="thin"/>`,
    geometry: `<circle cx="24" cy="36" r="16"/><circle cx="40" cy="36" r="16"/><path d="M24 36h16L32 22.1z"/><circle cx="24" cy="36" r="1.5" class="fill"/><circle cx="40" cy="36" r="1.5" class="fill"/><circle cx="32" cy="22.1" r="1.5" class="fill"/>`,
    cosmos: `<circle cx="32" cy="32" r="3.2" class="fill"/><circle cx="32" cy="32" r="9"/><circle cx="32" cy="32" r="16"/><circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="28.5" class="thin"/><circle cx="41" cy="32" r="1.9" class="fill"/><circle cx="20.7" cy="20.7" r="2.2" class="fill"/><circle cx="48.3" cy="48.3" r="2.4" class="fill"/><circle cx="16" cy="32" r="1.6" class="fill"/>`,
    sun: `<circle cx="32" cy="32" r="9.5"/><circle cx="32" cy="32" r="5" class="thin"/>` +
      Array.from({ length: 16 }, (_, i) => {
        const a = (i * Math.PI) / 8, r1 = 13.5, r2 = i % 2 ? 20 : 26;
        return `<path d="M${(32 + r1 * Math.cos(a)).toFixed(1)} ${(32 + r1 * Math.sin(a)).toFixed(1)}L${(32 + r2 * Math.cos(a)).toFixed(1)} ${(32 + r2 * Math.sin(a)).toFixed(1)}"/>`;
      }).join(""),
    torch: `<path d="M32 5c-5.5 6.5-8.5 11-6.5 17 1 2.5 3.5 4 6.5 4s5.5-1.5 6.5-4c2-6-1-10.5-6.5-17z"/><path d="M32 13.5c-2.2 3-3.2 5.5-2.2 8.2.5 1.2 1.3 1.8 2.2 1.8s1.7-.6 2.2-1.8c1-2.7 0-5.2-2.2-8.2z" class="thin"/><path d="M24.5 27h15l-3 5h-9z"/><path d="M28.5 32l1.8 26h3.4l1.8-26"/><path d="M29.5 40h5M30 48h4" class="thin"/>`,
    wheat: wheat(),
    fox: `<path d="M11 11l13 13 8-2 8 2 13-13-2 20c-1 11-9 19-19 25-10-6-18-14-19-25z"/><path d="M15 16.5l6 7M49 16.5l-6 7" class="thin"/><path d="M13.5 31L25 41l7 2.5 7-2.5 11.5-10"/><path d="M23 33.5l5 2M41 33.5l-5 2"/><circle cx="32" cy="52" r="1.8" class="fill"/>`,
    kylix: `<path d="M9 26h46c-2 8-11 12.5-23 12.5S11 34 9 26z"/><path d="M9.5 28c-5 .5-7-4.5-3-6.5M54.5 28c5 .5 7-4.5 3-6.5"/><path d="M29.5 38.5V49M34.5 38.5V49"/><path d="M21 54c1-4 21-4 22 0z"/><path d="M14 31.5h36" class="thin"/><path d="M18 34.5l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2" class="thin"/>`,
    scales: `<circle cx="32" cy="9.5" r="2.2"/><path d="M32 11.7V54"/><path d="M12 17.5h40"/><path d="M12 17.5L6 34M12 17.5L18 34M52 17.5L46 34M52 17.5L58 34" class="thin"/><path d="M4.5 34c0 5.5 15 5.5 15 0zM44.5 34c0 5.5 15 5.5 15 0z"/><path d="M23 57h18M26.5 54h11"/>`,
    staff: `<path d="M32 5v54"/><circle cx="32" cy="5" r="1.8" class="fill"/><path d="M38.5 55c-9-1-10-7.5-2-9.5 9-2.2 9-8.5 0-10.5-9-2-9-8.5 0-10.5 7.5-1.8 7.5-6.5 1-8.5"/><path d="M37.5 16c-1.5-.5-4.5-.2-5.5 1.8 2.5.8 4.3.8 5.5-1.8z" class="fill"/><path d="M36 17.5l3 .5" class="thin"/>`,
    grapes: grapes(),
    syrinx: [0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${14 + i * 5.3}" y="12" width="4.6" height="${40 - i * 4.5}" rx="2.3"/>`).join("") + `<path d="M11 19h42M11 25h42"/>`,
    eye: `<path d="M7 33c8-12 42-12 50 0-8 12-42 12-50 0z"/><circle cx="32" cy="33" r="8.5"/><circle cx="32" cy="33" r="3.4" class="fill"/><path d="M11 21c10-7 32-7 42 0"/><path d="M32 45v12M26 44l-2 10M38 44l2 10" class="thin"/>`,
    cave: `<path d="M6 57V35C6 20 17 9 32 9s26 11 26 26v22"/><path d="M2 57h60"/><path d="M13 57V37c0-11 8.5-19.5 19-19.5S51 26 51 37v20" class="thin"/><path d="M43 57c-3-3-3.5-6-1-9 .5 2 1.5 2.5 2.5 2.5 0-3 1-5 3-6.5 0 3 3 5 3 8.5 0 2.5-1 3.5-2.5 4.5"/><circle cx="21" cy="33" r="2.2" class="fill"/><path d="M21 35.5v6m-3-3h6m-3 3l-2.5 5m2.5-5l2.5 5" /><circle cx="29" cy="33" r="2.2" class="fill"/><path d="M29 35.5v6m-3-3h6m-3 3l-2.5 5m2.5-5l2.5 5"/>`,
    temple: `<path d="M7 22L32 10l25 12z"/><path d="M7 22h50v4.5H7z"/><path d="M11 26.5v23M16 26.5v23M24 26.5v23M29 26.5v23M35 26.5v23M40 26.5v23M48 26.5v23M53 26.5v23"/><path d="M5 49.5h54v3.5H5zM3 53h58v3.5H3z"/><circle cx="32" cy="17.5" r="2" class="thin"/>`,
    compass: `<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="26" class="thin"/><path d="M32 7l4.5 20.5L57 32l-20.5 4.5L32 57l-4.5-20.5L7 32l20.5-4.5z"/><path d="M32 18l2.8 11.2L46 32l-11.2 2.8L32 46l-2.8-11.2L18 32l11.2-2.8z" transform="rotate(45 32 32)" class="thin"/><circle cx="32" cy="32" r="2.2" class="fill"/>`,
    labyrinth: `<path d="M8 8h48v48H8V16h40v32H16V24h24v16H24v-8h8"/>`,
    lamp: `<path d="M12 38c0-6 12-9 22-8 9 1 15 4 17 8-2 4-8 7-19 7-11 0-20-2-20-7z"/><path d="M51 37l7-3c1.5 2 .5 4.5-1.5 5.5l-6 .5"/><path d="M12.5 37c-5 0-6.5-6.5-2-8.5"/><circle cx="31" cy="34" r="2.2"/><path d="M24 45h14l1.5 4h-17z"/><path d="M58 32c-2.5-3-1.5-6.5 1-9.5 2 3 3 6 1 9.5z" class="fill"/>`,
    olive: olive(),
    wing: `<path d="M8 44C16 22 36 10 58 9c-3 5-7 8-12 10 5 0 9-.5 12-2-3 5.5-8 8.5-14 10 4.5.5 8 .3 11-1-4 5-10 8-17 9 3.5.6 6.5.4 9-.5C40 42 30 45 20 45z"/><path d="M14 43c9-13 22-21 38-26M20 44c8-9 18-15 30-17M28 44.5c6-5 13-9 22-11" class="thin"/><path d="M8 44c-2 3-2 7 1 10"/>`,
    butterfly: `<path d="M32 19v28"/><circle cx="32" cy="16" r="2.3"/><path d="M31 14c-2-4-4.5-6-7-7M33 14c2-4 4.5-6 7-7"/><path d="M31 24C22 11 7 12 9 25c1.5 8 12 10 22 5"/><path d="M33 24c9-13 24-12 22 1-1.5 8-12 10-22 5"/><path d="M31 33c-8-1-16 3-14 11 2 7 10 4 14-6M33 33c8-1 16 3 14 11-2 7-10 4-14-6"/><circle cx="19" cy="22" r="2.5" class="thin"/><circle cx="45" cy="22" r="2.5" class="thin"/>`,
    moon: `<path d="M38 8a24 24 0 1 0 0 48A19.5 19.5 0 1 1 38 8z"/><path d="M48 14l1.2 3.3 3.3 1.2-3.3 1.2L48 23l-1.2-3.3-3.3-1.2 3.3-1.2zM54 31l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9zM46 44l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" class="fill"/>`,
    logic: `<path d="M14 14h36v36H14z"/><path d="M14 14l36 36M50 14L14 50"/><circle cx="14" cy="14" r="3.5" class="fill-bg"/><circle cx="50" cy="14" r="3.5" class="fill-bg"/><circle cx="14" cy="50" r="3.5" class="fill-bg"/><circle cx="50" cy="50" r="3.5" class="fill-bg"/><circle cx="32" cy="32" r="2" class="fill"/>`
  };

  const UI = {
    search: `<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>`,
    menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
    close: `<path d="M6 6l12 12M18 6L6 18"/>`,
    check: `<path d="M5 12.5l4.5 4.5L19 7.5"/>`,
    "arrow-right": `<path d="M5 12h14M13 6l6 6-6 6"/>`,
    "arrow-left": `<path d="M19 12H5M11 6l-6 6 6 6"/>`,
    "arrow-down": `<path d="M12 5v14M6 13l6 6 6-6"/>`,
    "chevron-down": `<path d="M6 9l6 6 6-6"/>`,
    "chevron-right": `<path d="M9 6l6 6-6 6"/>`,
    book: `<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5v13"/>`,
    clock: `<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>`,
    calendar: `<rect x="4" y="5.5" width="16" height="14" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>`,
    map: `<path d="M9 5L3.5 7v12L9 17l6 2 5.5-2V5L15 7z"/><path d="M9 5v12M15 7v12"/>`,
    layers: `<path d="M12 4l8.5 4.5L12 13 3.5 8.5z"/><path d="M3.5 12.5L12 17l8.5-4.5M3.5 16L12 20.5l8.5-4.5"/>`,
    filter: `<path d="M4 5.5h16l-6.2 7.3v5.2l-3.6 1.8v-7z"/>`,
    route: `<circle cx="6" cy="18" r="2.3"/><circle cx="18" cy="6" r="2.3"/><path d="M8.3 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.7"/>`,
    star: `<path d="M12 3.8l2.5 5.2 5.6.8-4.1 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.8z" class="fill"/>`,
    "star-o": `<path d="M12 3.8l2.5 5.2 5.6.8-4.1 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.8z"/>`,
    info: `<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.4"/>`,
    reset: `<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v3.8h3.8"/>`,
    ruler: `<path d="M3.5 15.5l12-12 5 5-12 12z"/><path d="M7.5 11.5l2 2M10.5 8.5l2 2M13.5 5.5l2 2" />`,
    feather: `<path d="M20 4c-6 0-12 4-13.5 11L5 19"/><path d="M20 4c0 7-5 12-12 12.5M8.5 12.5h6"/>`,
    user: `<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c.8-4 3.8-6.3 7.5-6.3s6.7 2.3 7.5 6.3"/>`,
    grid: `<rect x="4" y="4" width="7" height="7" rx="1.2"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><rect x="4" y="13" width="7" height="7" rx="1.2"/><rect x="13" y="13" width="7" height="7" rx="1.2"/>`,
    list: `<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="5" cy="6.5" r="1.2" class="fill"/><circle cx="5" cy="12" r="1.2" class="fill"/><circle cx="5" cy="17.5" r="1.2" class="fill"/>`,
    pin: `<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>`,
    sparkle: `<path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z"/><path d="M18.5 16l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>`,
    up: `<path d="M12 19V5M6 11l6-6 6 6"/>`,
    bookmark: `<path d="M6.5 4h11v16l-5.5-4-5.5 4z"/>`,
    eye: `<path d="M2.5 12c2.5-4.5 6-7 9.5-7s7 2.5 9.5 7c-2.5 4.5-6 7-9.5 7s-7-2.5-9.5-7z"/><circle cx="12" cy="12" r="3"/>`,
    quote: `<path d="M9.5 7C6.5 8 5 10.5 5 13.5V17h4.5v-4.5H7.2c.2-2 1.2-3.2 2.8-3.8zM18.5 7c-3 1-4.5 3.5-4.5 6.5V17h4.5v-4.5h-2.3c.2-2 1.2-3.2 2.8-3.8z" class="fill"/>`,
    download: `<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>`,
    trash: `<path d="M5 7h14M9.5 7V5h5v2M7 7l1 13h8l1-13"/>`
  };

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">`;
  for (const [k, v] of Object.entries(MOTIFS)) svg += `<symbol id="m-${k}" viewBox="0 0 64 64">${v}</symbol>`;
  for (const [k, v] of Object.entries(UI)) svg += `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`;
  svg += `</svg>`;

  window.KLASIK = window.KLASIK || {};
  window.KLASIK.motifs = Object.keys(MOTIFS);
  const mount = () => document.body.insertAdjacentHTML("afterbegin", svg);
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
