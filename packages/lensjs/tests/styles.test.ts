import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// Every member of the LensEffect / LensFilter unions must have a matching rule in the shipped stylesheet
const effects = [
  'zoom', 'glare', 'glass', 'blur-vignette', 'invert', 'invert-full', 'reveal',
  'magnify', 'blur-lens', 'grayscale-lens', 'flip-reveal', 'neon',
  'vortex', 'noise', 'glitch', 'fisheye', 'pixelate', 'denoise', 'resolution-boost',
  'wave', 'chromatic-aberration', 'halftone', 'posterize', 'melt',
  'tilt-3d', 'spotlight', 'ken-burns', 'scanlines',
  'shadow', 'heart-beat',
] as const;

const filters = [
  'bladerunner', 'twilight-1', 'twilight-2', 'twilight-3',
  'matrix', 'noir', 'mad-max', 'grayscale',
  'cyberpunk', 'vintage', 'sunset', 'oceanic',
  'duotone-purple', 'duotone-red', 'duotone-cyan',
  'dreamy', 'vintage-high', 'amaro',
  'blur-soft', 'blur', 'blur-heavy', 'motion-blur', 'motion-blur-vertical',
  'liquid-glass',
] as const;

const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

describe('styles.css', () => {
  it('should include base wrapper styles', () => {
    expect(css).toContain('.lens-image-wrapper');
  });

  it.each(effects)('should include a rule for the "%s" effect', (effect) => {
    expect(css).toContain(`[data-lens-effect="${effect}"]`);
  });

  it.each(filters)('should include a rule for the "%s" filter preset', (filter) => {
    expect(css).toContain(`[data-lens-filter="${filter}"]`);
  });

  it('should wire CSS effects to the intensity variable', () => {
    expect(css).toContain('var(--lens-intensity');
  });

  it('should support the square lens shape', () => {
    expect(css).toContain('[data-lens-shape="square"]');
  });
});
