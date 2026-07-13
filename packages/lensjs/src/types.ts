export type LensEffect =
  | 'zoom'
  | 'glare'
  | 'glass'
  | 'blur-vignette'
  | 'invert'
  | 'invert-full'
  | 'reveal'
  | 'magnify'
  | 'blur-lens'
  | 'grayscale-lens'
  | 'flip-reveal'
  | 'neon'
  | 'vortex'
  | 'noise'
  | 'glitch'
  | 'fisheye'
  | 'pixelate'
  | 'denoise'
  | 'resolution-boost'
  | 'wave'
  | 'chromatic-aberration'
  | 'halftone'
  | 'posterize'
  | 'melt'
  | 'tilt-3d'
  | 'spotlight'
  | 'ken-burns'
  | 'scanlines'
  | 'shadow'
  | 'heart-beat';

/** Movie-inspired color grading presets, applied via the `filter` prop. */
export type LensFilter =
  | 'bladerunner'
  | 'twilight-1'
  | 'twilight-2'
  | 'twilight-3'
  | 'matrix'
  | 'noir'
  | 'mad-max'
  | 'grayscale'
  | 'cyberpunk'
  | 'vintage'
  | 'sunset'
  | 'oceanic'
  | 'duotone-purple'
  | 'duotone-red'
  | 'duotone-cyan'
  | 'dreamy'
  | 'vintage-high'
  | 'amaro'
  | 'blur-soft'
  | 'blur'
  | 'blur-heavy'
  | 'motion-blur'
  | 'motion-blur-vertical'
  | 'liquid-glass';

/** Raw RGBA pixel buffer — structurally compatible with canvas ImageData. */
export interface PixelData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}
