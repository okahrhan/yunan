"""Mermer dokularını (kesintisiz döşenebilir) üretir: assets/marble-light.webp, assets/marble-dark.webp
Gereksinim: pip install numpy pillow   Kullanım: python3 scripts/make-textures.py
FFT tabanlı gürültü doğası gereği periyodik olduğundan dokular dikişsiz tekrar eder."""
import numpy as np
from PIL import Image

N = 900
rng = np.random.default_rng(11)
fx = np.fft.fftfreq(N)[:, None]
fy = np.fft.fftfreq(N)[None, :]


def noise(scale, power=2.0, stretch=1.0, angle=0.6):
    """Periyodik, isteğe bağlı olarak yönlü (uzatılmış) fraktal gürültü."""
    c, s = np.cos(angle), np.sin(angle)
    u = (fx * c + fy * s) * stretch
    v = (-fx * s + fy * c)
    f = np.sqrt(u ** 2 + v ** 2)
    f[0, 0] = 1
    spec = np.fft.fft2(rng.standard_normal((N, N))) / f ** power
    spec *= np.exp(-(f / scale) ** 2)
    out = np.real(np.fft.ifft2(spec))
    return (out - out.mean()) / out.std()


def warp(field, dx, dy):
    """Alanı (periyodik) bilineer örnekleme ile büker."""
    i, j = np.mgrid[0:N, 0:N].astype(float)
    y, x = (i + dy) % N, (j + dx) % N
    y0, x0 = np.floor(y).astype(int), np.floor(x).astype(int)
    ty, tx = y - y0, x - x0
    y1, x1 = (y0 + 1) % N, (x0 + 1) % N
    return (field[y0, x0] * (1 - ty) * (1 - tx) + field[y0, x1] * (1 - ty) * tx
            + field[y1, x0] * ty * (1 - tx) + field[y1, x1] * ty * tx)


wx, wy = noise(0.02) * 55, noise(0.02) * 55
main = warp(noise(0.03, stretch=2.4), wx, wy)
hair = warp(noise(0.08, stretch=1.8, angle=0.9), wx * 0.7, wy * 0.7)
cloud = warp(noise(0.015, stretch=1.5), wx, wy)
speck = noise(0.4, power=0.8)

v_main = np.exp(-(main ** 2) / 0.004)
v_soft = np.exp(-(main ** 2) / 0.06)
v_hair = np.exp(-((hair - 0.8) ** 2) / 0.0015) * (0.4 + 0.6 * (cloud > -0.3))


def render(base, vein_col, soft_col, cloud_col, strength, path):
    img = np.ones((N, N, 3)) * np.array(base, float)
    c = np.clip((cloud + 2.5) / 5, 0, 1)[..., None]
    img = img * (1 - 0.45 * c) + np.array(cloud_col, float) * 0.45 * c
    img += speck[..., None] * 1.6
    for layer, col, k in ((v_soft, soft_col, 0.4), (v_main, vein_col, 0.75), (v_hair, vein_col, 0.35)):
        a = (layer * k * strength)[..., None]
        img = img * (1 - a) + np.array(col, float) * a
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(path, "WEBP", quality=74, method=6)


render((245, 241, 233), (160, 152, 140), (222, 214, 200), (236, 229, 215), 1.0, "assets/marble-light.webp")
render((15, 24, 45), (86, 98, 130), (34, 47, 78), (22, 33, 60), 0.85, "assets/marble-dark.webp")
print("dokular yazıldı")
