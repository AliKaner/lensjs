/**
 * Posterize — quantizes each channel to a handful of levels, producing
 * flat poster-print color bands. Higher strength = fewer levels.
 */

import { PixelData } from '../types';

export function applyPosterize(src: PixelData, dst: PixelData, strength: number): void {
  const s = src.data;
  const d = dst.data;

  if (strength <= 0) {
    d.set(s);
    return;
  }

  // strength 1 -> 4 levels per channel, softer strengths keep more levels
  const levels = Math.max(4, Math.round(16 - 12 * Math.min(1, strength)));
  const step = 255 / (levels - 1);
  const lut = new Uint8ClampedArray(256);
  for (let v = 0; v < 256; v++) {
    lut[v] = Math.round(Math.round(v / step) * step);
  }

  for (let i = 0; i < s.length; i += 4) {
    d[i] = lut[s[i]];
    d[i + 1] = lut[s[i + 1]];
    d[i + 2] = lut[s[i + 2]];
    d[i + 3] = s[i + 3];
  }
}
