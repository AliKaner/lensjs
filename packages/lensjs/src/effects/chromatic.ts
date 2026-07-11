/**
 * Chromatic aberration — red and blue channels drift apart radially,
 * growing stronger towards the edges, like an imperfect camera lens.
 */

import { PixelData } from '../types';

/** Radial channel displacement factor when the effect is fully active. */
export const CHROMATIC_MAX_SHIFT = 0.05;

export function applyChromatic(src: PixelData, dst: PixelData, shift: number): void {
  const { width: w, height: h } = src;
  const cx = w / 2;
  const cy = h / 2;
  const s = src.data;
  const d = dst.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const nx = dx / cx;
      const ny = dy / cy;
      const r2 = nx * nx + ny * ny;
      const kR = 1 + shift * r2;
      const kB = 1 - shift * r2;

      const clampX = (v: number) => (v < 0 ? 0 : v >= w ? w - 1 : v);
      const clampY = (v: number) => (v < 0 ? 0 : v >= h ? h - 1 : v);

      const rx = clampX(Math.round(cx + dx * kR));
      const ry = clampY(Math.round(cy + dy * kR));
      const bx = clampX(Math.round(cx + dx * kB));
      const by = clampY(Math.round(cy + dy * kB));

      const di = (y * w + x) * 4;
      d[di] = s[(ry * w + rx) * 4];
      d[di + 1] = s[di + 1];
      d[di + 2] = s[(by * w + bx) * 4 + 2];
      d[di + 3] = s[di + 3];
    }
  }
}
