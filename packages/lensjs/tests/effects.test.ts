import { describe, it, expect } from 'vitest';
import type { PixelData } from '../src/types';
import {
  applyVortex,
  applyNoise,
  applyGlitch,
  applyFisheye,
  applyPixelate,
  applyDenoise,
  applySharpen,
} from '../src/effects';

const W = 32;
const H = 32;

function makeImage(): PixelData {
  const data = new Uint8ClampedArray(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    data[i * 4] = (i * 31) % 256;
    data[i * 4 + 1] = (i * 7) % 256;
    data[i * 4 + 2] = (i * 13) % 256;
    data[i * 4 + 3] = 255;
  }
  return { data, width: W, height: H };
}

function makeEmpty(): PixelData {
  return { data: new Uint8ClampedArray(W * H * 4), width: W, height: H };
}

const zeroStrengthCases: [string, (s: PixelData, d: PixelData, v: number) => void][] = [
  ['vortex', applyVortex],
  ['noise', (s, d, v) => applyNoise(s, d, v, 1)],
  ['glitch', (s, d, v) => applyGlitch(s, d, v, 1)],
  ['fisheye', applyFisheye],
  ['pixelate', (s, d, v) => applyPixelate(s, d, 1 + v)],
  ['denoise', applyDenoise],
  ['sharpen', applySharpen],
];

describe('pixel effects', () => {
  it.each(zeroStrengthCases)('%s should be an identity at zero strength', (_name, apply) => {
    const src = makeImage();
    const dst = makeEmpty();
    apply(src, dst, 0);
    expect(dst.data).toEqual(src.data);
  });

  it.each(zeroStrengthCases)('%s should change pixels at full strength without touching the source', (_name, apply) => {
    const src = makeImage();
    const original = new Uint8ClampedArray(src.data);
    const dst = makeEmpty();
    apply(src, dst, 1);
    expect(dst.data).not.toEqual(original);
    expect(src.data).toEqual(original);
  });

  it('vortex should leave the corners outside the swirl radius untouched', () => {
    const src = makeImage();
    const dst = makeEmpty();
    applyVortex(src, dst, 2.2);
    expect(dst.data.slice(0, 4)).toEqual(src.data.slice(0, 4));
  });

  it('noise should be deterministic for the same seed and differ across seeds', () => {
    const src = makeImage();
    const a = makeEmpty();
    const b = makeEmpty();
    const c = makeEmpty();
    applyNoise(src, a, 0.3, 42);
    applyNoise(src, b, 0.3, 42);
    applyNoise(src, c, 0.3, 43);
    expect(a.data).toEqual(b.data);
    expect(a.data).not.toEqual(c.data);
  });

  it('noise should preserve the alpha channel', () => {
    const src = makeImage();
    const dst = makeEmpty();
    applyNoise(src, dst, 0.3, 7);
    for (let i = 3; i < dst.data.length; i += 4) {
      expect(dst.data[i]).toBe(255);
    }
  });

  it('pixelate should make every pixel in a block identical', () => {
    const src = makeImage();
    const dst = makeEmpty();
    applyPixelate(src, dst, 8);
    // All pixels of the first 8x8 block share the block average
    const first = dst.data.slice(0, 4);
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const i = (y * W + x) * 4;
        expect(dst.data.slice(i, i + 4)).toEqual(first);
      }
    }
  });
});
