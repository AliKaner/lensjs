/**
 * De-noise — 3x3 gaussian smoothing blended with the original by `amount`,
 * softening grain and compression artifacts.
 */

import { PixelData } from '../types';

export function applyDenoise(src: PixelData, dst: PixelData, amount: number): void {
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
      // 3x3 gaussian kernel: 1 2 1 / 2 4 2 / 1 2 1 (sum 16)
      for (let c = 0; c < 3; c++) {
        const smooth =
          (s[(yu * w + xl) * 4 + c] +
            2 * s[(yu * w + x) * 4 + c] +
            s[(yu * w + xr) * 4 + c] +
            2 * s[(y * w + xl) * 4 + c] +
            4 * s[i + c] +
            2 * s[(y * w + xr) * 4 + c] +
            s[(yd * w + xl) * 4 + c] +
            2 * s[(yd * w + x) * 4 + c] +
            s[(yd * w + xr) * 4 + c]) /
          16;
        d[i + c] = s[i + c] + (smooth - s[i + c]) * amount;
      }
      d[i + 3] = s[i + 3];
    }
  }
}
