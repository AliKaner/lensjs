/**
 * Pixelate (mosaic) — replaces square blocks with their average color.
 * Animating the block size from 1 upwards makes the image "de-res" smoothly.
 */

import { PixelData } from '../types';

/** Block size in pixels when the effect is fully active. */
export const PIXELATE_MAX_BLOCK = 24;

export function applyPixelate(src: PixelData, dst: PixelData, blockSize: number): void {
  const { width: w, height: h } = src;
  const s = src.data;
  const d = dst.data;
  const b = Math.max(1, Math.floor(blockSize));

  if (b === 1) {
    d.set(s);
    return;
  }

  for (let by = 0; by < h; by += b) {
    const yEnd = Math.min(h, by + b);
    for (let bx = 0; bx < w; bx += b) {
      const xEnd = Math.min(w, bx + b);

      let r = 0;
      let g = 0;
      let bl = 0;
      let a = 0;
      let n = 0;
      for (let y = by; y < yEnd; y++) {
        for (let x = bx; x < xEnd; x++) {
          const i = (y * w + x) * 4;
          r += s[i];
          g += s[i + 1];
          bl += s[i + 2];
          a += s[i + 3];
          n++;
        }
      }
      r /= n;
      g /= n;
      bl /= n;
      a /= n;

      for (let y = by; y < yEnd; y++) {
        for (let x = bx; x < xEnd; x++) {
          const i = (y * w + x) * 4;
          d[i] = r;
          d[i + 1] = g;
          d[i + 2] = bl;
          d[i + 3] = a;
        }
      }
    }
  }
}
