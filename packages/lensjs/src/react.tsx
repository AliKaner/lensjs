"use client";
import React from 'react';

import { LensEffect, LensFilter, PixelData } from './types';
import {
  applyVortex,
  VORTEX_MAX_STRENGTH,
  applyNoise,
  NOISE_MAX_AMOUNT,
  applyGlitch,
  applyFisheye,
  FISHEYE_MAX_STRENGTH,
  applyPixelate,
  PIXELATE_MAX_BLOCK,
  applyDenoise,
  applySharpen,
  SHARPEN_MAX_AMOUNT,
  applyWave,
  applyChromatic,
  CHROMATIC_MAX_SHIFT,
  applyHalftone,
  HALFTONE_BLOCK,
  applyPosterize,
  applyMelt,
} from './effects';

export type { LensEffect, LensFilter };

export interface LensImageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'crossOrigin'> {
  effect?: LensEffect;
  /** Movie-inspired color grading preset; composes with any `effect`. */
  filter?: LensFilter;
  /** Second image revealed inside the cursor lens when `effect="reveal"`. */
  revealSrc?: string;
  /** Effect strength multiplier (0..2). 1 = default look, 0 disables, 2 doubles. */
  intensity?: number;
  /** Lens diameter in px for the lens effects (invert, reveal). Default 130. */
  lensSize?: number;
  /** Lens shape for the lens effects (invert, reveal). Default 'circle'. */
  lensShape?: 'circle' | 'square';
  // Image props (optional if child element is used instead)
  src?: string;
  alt?: string;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  children?: React.ReactNode;
}

export interface LensConfig {
  intensity?: number;
  lensSize?: number;
  lensShape?: 'circle' | 'square';
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
}

const LensContext = React.createContext<LensConfig>({});

export interface LensProviderProps {
  value: LensConfig;
  children: React.ReactNode;
}

export function LensProvider({ value, children }: LensProviderProps) {
  return <LensContext.Provider value={value}>{children}</LensContext.Provider>;
}

export function useLensConfig() {
  return React.useContext(LensContext);
}

interface CanvasRenderer {
  render(src: PixelData, dst: PixelData, progress: number, frame: number): void;
  /** Keep re-rendering every frame while hovered (for animated effects like grain/glitch). */
  continuous?: boolean;
}

const canvasRenderers: Partial<Record<LensEffect, CanvasRenderer>> = {
  vortex: { render: (s, d, p) => applyVortex(s, d, VORTEX_MAX_STRENGTH * p) },
  fisheye: { render: (s, d, p) => applyFisheye(s, d, FISHEYE_MAX_STRENGTH * p) },
  noise: { render: (s, d, p, f) => applyNoise(s, d, NOISE_MAX_AMOUNT * p, f), continuous: true },
  glitch: { render: (s, d, p, f) => applyGlitch(s, d, p, Math.floor(f / 4)), continuous: true },
  pixelate: { render: (s, d, p) => applyPixelate(s, d, 1 + (PIXELATE_MAX_BLOCK - 1) * p) },
  denoise: { render: (s, d, p) => applyDenoise(s, d, p) },
  'resolution-boost': { render: (s, d, p) => applySharpen(s, d, SHARPEN_MAX_AMOUNT * p) },
  wave: { render: (s, d, p, f) => applyWave(s, d, p, f * 0.12), continuous: true },
  'chromatic-aberration': { render: (s, d, p) => applyChromatic(s, d, CHROMATIC_MAX_SHIFT * p) },
  halftone: { render: (s, d, p) => applyHalftone(s, d, HALFTONE_BLOCK, p) },
  posterize: { render: (s, d, p) => applyPosterize(s, d, p) },
  melt: { render: (s, d, p, f) => applyMelt(s, d, p, f * 0.05), continuous: true },
};

/** Pixel buffers are capped at this dimension to keep per-frame processing cheap. */
const CANVAS_MAX_DIM = 600;

function useCanvasEffect(
  effect: LensEffect | undefined,
  src: string | undefined,
  intensity: number,
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  imgRef: React.RefObject<HTMLImageElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  React.useEffect(() => {
    const renderer = effect && canvasRenderers[effect];
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!renderer || !wrapper || !img || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let progress = 0;
    let target = 0;
    let frame = 0;
    let source: ImageData | null = null;
    let out: ImageData | null = null;

    const prepare = () => {
      if (!img.complete || !img.naturalWidth) return false;
      const scale = Math.min(1, CANVAS_MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      try {
        source = ctx.getImageData(0, 0, w, h);
      } catch {
        // Cross-origin image without CORS taints the canvas; leave the effect off
        source = null;
        return false;
      }
      out = ctx.createImageData(w, h);
      return true;
    };

    const tick = () => {
      raf = 0;
      if (!source || !out) return;
      frame++;
      progress += (target - progress) * 0.15;
      if (Math.abs(target - progress) < 0.01) progress = target;
      if (progress > 0) {
        renderer.render(source, out, progress, frame);
        ctx.putImageData(out, 0, 0);
      }
      canvas.style.opacity = progress > 0 ? '1' : '0';
      if (progress !== target || (renderer.continuous && progress > 0)) {
        raf = requestAnimationFrame(tick);
      }
    };

    const animateTo = (value: number) => {
      target = value;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const enter = () => {
      if (source || prepare()) animateTo(Math.max(0, Math.min(2, intensity)));
    };
    const leave = () => animateTo(0);
    const reset = () => {
      source = null;
      canvas.style.opacity = '0';
    };

    img.addEventListener('load', reset);
    wrapper.addEventListener('mouseenter', enter);
    wrapper.addEventListener('mouseleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      img.removeEventListener('load', reset);
      wrapper.removeEventListener('mouseenter', enter);
      wrapper.removeEventListener('mouseleave', leave);
    };
  }, [effect, src, intensity, wrapperRef, imgRef, canvasRef]);
}

export function LensImage({
  effect,
  filter,
  revealSrc,
  intensity,
  lensSize,
  lensShape,
  crossOrigin,
  src,
  alt,
  children,
  className,
  style,
  ...props
}: LensImageProps) {
  const globalConfig = useLensConfig();

  const activeIntensity = intensity ?? globalConfig.intensity ?? 1;
  const activeLensSize = lensSize ?? globalConfig.lensSize;
  const activeLensShape = lensShape ?? globalConfig.lensShape ?? 'circle';
  const activeCrossOrigin = crossOrigin ?? globalConfig.crossOrigin;

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const usesCanvas = effect !== undefined && effect in canvasRenderers;
  useCanvasEffect(usesCanvas ? effect : undefined, src, activeIntensity, wrapperRef, imgRef, canvasRef);

  const wrapperStyle: React.CSSProperties = {
    display: 'inline-block',
    position: 'relative',
    // CSS effects read these custom properties from styles.css
    ...(activeIntensity !== 1 ? ({ '--lens-intensity': activeIntensity } as React.CSSProperties) : null),
    ...(activeLensSize !== undefined ? ({ '--lens-size': `${activeLensSize}px` } as React.CSSProperties) : null),
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    wrapper.style.setProperty('--lens-x', `${e.clientX - rect.left}px`);
    wrapper.style.setProperty('--lens-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={wrapperRef}
      className={`lens-image-wrapper ${children ? className || '' : ''}`}
      data-lens-effect={effect}
      data-lens-filter={filter}
      data-lens-shape={activeLensShape}
      onMouseMove={handleMouseMove}
      style={{
        ...wrapperStyle,
        ...(children ? style : null)
      }}
      {...(children ? props : null)}
    >
      {children ? (
        children
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          crossOrigin={usesCanvas ? (activeCrossOrigin || 'anonymous') as any : activeCrossOrigin}
          className={className}
          style={style}
          {...(props as any)}
        />
      )}
      {usesCanvas && <canvas ref={canvasRef} className="lens-canvas" aria-hidden="true" />}
      {effect === 'reveal' && revealSrc && (
        <img src={revealSrc} alt="" aria-hidden="true" className="lens-reveal-img" />
      )}
    </div>
  );
}
