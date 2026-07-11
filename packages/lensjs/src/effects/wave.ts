/**
 * Wave — sinusoidal displacement in both axes, like looking through
 * rippling water. Animate `phase` to make the ripples flow.
 */

import { PixelData } from '../types';

/** Peak displacement in pixels when the effect is fully active. */
export const WAVE_MAX_AMPLITUDE = 10;

export function applyWave(src: PixelData, dst: PixelData, strength: number, phase = 0): void {
  const { width: w, height: h } = src;
  const s = src.data;
  const d = dst.data;
  const ampX = strength * WAVE_MAX_AMPLITUDE;
  const ampY = ampX * 0.6;

  for (let y = 0; y < h; y++) {
    const dxRow = ampX * Math.sin(y * 0.08 + phase);
    for (let x = 0; x < w; x++) {
      let sx = Math.round(x + dxRow);
      let sy = Math.round(y + ampY * Math.sin(x * 0.06 + phase * 1.3));
      if (sx < 0) sx = 0;
      else if (sx >= w) sx = w - 1;
      if (sy < 0) sy = 0;
      else if (sy >= h) sy = h - 1;
      const di = (y * w + x) * 4;
      const si = (sy * w + sx) * 4;
      d[di] = s[si];
      d[di + 1] = s[si + 1];
      d[di + 2] = s[si + 2];
      d[di + 3] = s[si + 3];
    }
  }
}
