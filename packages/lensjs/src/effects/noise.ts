/**
 * Noise (film grain) — adds monochrome random grain to every pixel.
 * Deterministic for a given seed, so frames can be animated by advancing the seed.
 */

import { PixelData } from '../types';

/** Grain intensity (0..1 of full range) when the effect is fully active. */
export const NOISE_MAX_AMOUNT = 0.28;

export function applyNoise(src: PixelData, dst: PixelData, amount: number, seed = 0): void {
  const s = src.data;
  const d = dst.data;
  const count = src.width * src.height;
  const scale = amount * 255 * 2;
  // xorshift32 PRNG seeded per call — cheap and deterministic
  let state = ((seed + 1) * 2654435761) >>> 0;

  for (let i = 0; i < count; i++) {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    const grain = (state / 4294967296 - 0.5) * scale;
    const p = i * 4;
    d[p] = s[p] + grain;
    d[p + 1] = s[p + 1] + grain;
    d[p + 2] = s[p + 2] + grain;
    d[p + 3] = s[p + 3];
  }
}
