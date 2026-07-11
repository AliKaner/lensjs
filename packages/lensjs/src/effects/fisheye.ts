/**
 * Fisheye — barrel distortion that bulges the center of the image outward,
 * as if viewed through a wide-angle lens. Edges stay anchored.
 */

import { PixelData } from '../types';

/** Distortion amount (0..1) when the effect is fully active. */
export const FISHEYE_MAX_STRENGTH = 0.55;

export function applyFisheye(src: PixelData, dst: PixelData, strength: number): void {
  const { width: w, height: h } = src;
  const cx = w / 2;
  const cy = h / 2;
  const s = src.data;
  const d = dst.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sx = x;
      let sy = y;
      // Normalize to a unit ellipse spanning the whole image
      const nx = (x - cx) / cx;
      const ny = (y - cy) / cy;
      const rd = Math.sqrt(nx * nx + ny * ny);

      if (rd > 0 && rd < 1) {
        // Inverse mapping: pull samples towards the center (rs <= rd),
        // magnifying the middle while keeping the rim (rd = 1) fixed
        const rs = rd + strength * rd * (rd * rd - 1);
        const k = rs / rd;
        sx = Math.round(cx + nx * k * cx);
        sy = Math.round(cy + ny * k * cy);
        if (sx < 0) sx = 0;
        else if (sx >= w) sx = w - 1;
        if (sy < 0) sy = 0;
        else if (sy >= h) sy = h - 1;
      }

      const di = (y * w + x) * 4;
      const si = (sy * w + sx) * 4;
      d[di] = s[si];
      d[di + 1] = s[si + 1];
      d[di + 2] = s[si + 2];
      d[di + 3] = s[si + 3];
    }
  }
}
