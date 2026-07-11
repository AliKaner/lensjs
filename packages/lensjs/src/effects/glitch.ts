/**
 * Glitch — RGB channel separation plus randomly displaced horizontal slices,
 * like a corrupted VHS frame. Deterministic for a given seed so the flicker
 * can be animated by advancing the seed.
 */

import { PixelData } from '../types';

export function applyGlitch(src: PixelData, dst: PixelData, intensity: number, seed = 0): void {
  const { width: w, height: h } = src;
  const s = src.data;
  const d = dst.data;

  let state = ((seed + 1) * 2654435761) >>> 0;
  const rnd = () => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };

  // Base pass: copy with horizontal RGB channel separation
  const shift = Math.round(intensity * w * 0.015);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      const di = (row + x) * 4;
      const xr = Math.min(w - 1, x + shift);
      const xb = Math.max(0, x - shift);
      d[di] = s[(row + xr) * 4];
      d[di + 1] = s[di + 1];
      d[di + 2] = s[(row + xb) * 4 + 2];
      d[di + 3] = s[di + 3];
    }
  }

  // Slice pass: displace a few random horizontal bands
  const slices = Math.round(intensity * 8);
  for (let i = 0; i < slices; i++) {
    const sliceY = Math.floor(rnd() * h);
    const sliceH = Math.max(2, Math.floor(rnd() * h * 0.06));
    const dx = Math.round((rnd() - 0.5) * 2 * intensity * w * 0.08);
    const yEnd = Math.min(h, sliceY + sliceH);
    for (let y = sliceY; y < yEnd; y++) {
      const row = y * w;
      for (let x = 0; x < w; x++) {
        const sx = Math.min(w - 1, Math.max(0, x + dx));
        const di = (row + x) * 4;
        const si = (row + sx) * 4;
        d[di] = s[si];
        d[di + 1] = s[si + 1];
        d[di + 2] = s[si + 2];
        d[di + 3] = s[si + 3];
      }
    }
  }
}
