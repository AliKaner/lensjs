/**
 * Melt — columns of pixels sag downward with wavy, per-column drips,
 * as if the image were melting. Animate `phase` to make the drips crawl.
 */

import { PixelData } from '../types';

export function applyMelt(src: PixelData, dst: PixelData, strength: number, phase = 0): void {
  const { width: w, height: h } = src;
  const s = src.data;
  const d = dst.data;

  for (let x = 0; x < w; x++) {
    // Smooth per-column drip length (-1..1 wobble mapped to 0.2..1)
    const wob = (Math.sin(x * 0.12 + phase) + Math.sin(x * 0.053 + phase * 0.7)) * 0.5;
    const maxDrip = strength * h * 0.18 * (0.6 + 0.4 * wob);
    for (let y = 0; y < h; y++) {
      // More melt towards the bottom
      const t = y / h;
      let sy = Math.round(y - maxDrip * t * Math.sqrt(t));
      if (sy < 0) sy = 0;
      const di = (y * w + x) * 4;
      const si = (sy * w + x) * 4;
      d[di] = s[si];
      d[di + 1] = s[si + 1];
      d[di + 2] = s[si + 2];
      d[di + 3] = s[si + 3];
    }
  }
}
