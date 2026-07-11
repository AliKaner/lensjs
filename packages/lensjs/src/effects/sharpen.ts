/**
 * Sharpen (resolution boost) — unsharp-mask style laplacian sharpening that
 * increases perceived detail and edge contrast. This is classic image
 * processing, not ML super-resolution: it cannot invent new pixels.
 */

import { PixelData } from '../types';

/** Sharpening amount when the effect is fully active. */
export const SHARPEN_MAX_AMOUNT = 0.8;

export function applySharpen(src: PixelData, dst: PixelData, amount: number): void {
  const { width: w, height: h } = src;
  const s = src.data;
  const d = dst.data;

  for (let y = 0; y < h; y++) {
    const yu = y > 0 ? y - 1 : 0;
    const yd = y < h - 1 ? y + 1 : h - 1;
    for (let x = 0; x < w; x++) {
      const xl = x > 0 ? x - 1 : 0;
      const xr = x < w - 1 ? x + 1 : w - 1;
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const lap =
          4 * s[i + c] -
          s[(yu * w + x) * 4 + c] -
          s[(yd * w + x) * 4 + c] -
          s[(y * w + xl) * 4 + c] -
          s[(y * w + xr) * 4 + c];
        d[i + c] = s[i + c] + lap * amount;
      }
      d[i + 3] = s[i + 3];
    }
  }
}
