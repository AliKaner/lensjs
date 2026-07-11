/**
 * Halftone — re-draws the image as a grid of colored dots on white,
 * like newspaper print. Dot size follows block darkness; `strength`
 * blends between the original and the halftone rendering.
 */

import { PixelData } from '../types';

/** Dot grid cell size in pixels. */
export const HALFTONE_BLOCK = 8;

export function applyHalftone(src: PixelData, dst: PixelData, blockSize: number, strength: number): void {
  const { width: w, height: h } = src;
  const s = src.data;
  const d = dst.data;

  if (strength <= 0) {
    d.set(s);
    return;
  }

  const b = Math.max(2, Math.floor(blockSize));
  const blend = Math.min(1, strength);

  for (let by = 0; by < h; by += b) {
    const yEnd = Math.min(h, by + b);
    for (let bx = 0; bx < w; bx += b) {
      const xEnd = Math.min(w, bx + b);

      let r = 0;
      let g = 0;
      let bl = 0;
      let n = 0;
      for (let y = by; y < yEnd; y++) {
        for (let x = bx; x < xEnd; x++) {
          const i = (y * w + x) * 4;
          r += s[i];
          g += s[i + 1];
          bl += s[i + 2];
          n++;
        }
      }
      r /= n;
      g /= n;
      bl /= n;

      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * bl;
      const dotR = (b / 2) * 1.2 * (1 - lum / 255);
      const dotR2 = dotR * dotR;
      const ccx = bx + (xEnd - bx) / 2;
      const ccy = by + (yEnd - by) / 2;

      for (let y = by; y < yEnd; y++) {
        for (let x = bx; x < xEnd; x++) {
          const i = (y * w + x) * 4;
          const ddx = x + 0.5 - ccx;
          const ddy = y + 0.5 - ccy;
          const inside = ddx * ddx + ddy * ddy <= dotR2;
          const hr = inside ? r : 255;
          const hg = inside ? g : 255;
          const hb = inside ? bl : 255;
          d[i] = s[i] + (hr - s[i]) * blend;
          d[i + 1] = s[i + 1] + (hg - s[i + 1]) * blend;
          d[i + 2] = s[i + 2] + (hb - s[i + 2]) * blend;
          d[i + 3] = s[i + 3];
        }
      }
    }
  }
}
