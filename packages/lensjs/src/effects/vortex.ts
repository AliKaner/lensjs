/**
 * Vortex (swirl) distortion — rotates pixels around the image center,
 * with the twist angle fading out towards the effect radius.
 * Operates on raw RGBA pixel buffers so it can run anywhere (canvas, workers, tests).
 */

import { PixelData } from '../types';

/** Twist angle (radians) applied at the very center when the effect is fully active. */
export const VORTEX_MAX_STRENGTH = 2.2;

export function applyVortex(src: PixelData, dst: PixelData, strength: number): void {
  const { width: w, height: h } = src;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(cx, cy);
  const s = src.data;
  const d = dst.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sx = x;
      let sy = y;
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.sqrt(dx * dx + dy * dy);

      if (r < radius) {
        // Inverse mapping: find where this destination pixel comes from
        const t = 1 - r / radius;
        const angle = strength * t * t;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        sx = Math.round(cx + dx * cos - dy * sin);
        sy = Math.round(cy + dx * sin + dy * cos);
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
