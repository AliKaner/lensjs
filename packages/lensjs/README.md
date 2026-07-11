# 📷 @alikaner/lensjs

A lightweight, high-performance interactive image visual effects wrapper for React and Next.js applications. Apply glassmorphic glare sweeps, shifting neon borders, cursor-following color inverters, double-exposure image reveals, and 12+ animated canvas filter shaders with a simple declarative JSX tag.

Now supports **arbitrary HTML elements** wrapping (e.g. glitching buttons, glowing text, glassmorphic cards) and **dynamic configuration themes**!

---

## ✨ Features

- **Zero-Dependency Core**: Lightweight footprint driven by high-performance CSS transforms and vanilla Canvas pixel shaders.
- **30 Interactive Hover Effects**: Cursor lenses (magnify, invert, reveal, blur, grayscale), canvas pixel distortions (vortex, glitch, wave, fisheye, melt, halftone…), and cinematic CSS motion (tilt-3d, ken-burns, spotlight, flip-reveal, scanlines…).
- **18 Movie-Inspired Filter Presets**: Permanent cinematic color grades (Blade Runner, Matrix, Cyberpunk, Twilight, Noir, Sunset, Duotones, and Bloom) that compose seamlessly with hover effects.
- **Fine-Tuning Props**: Scale any effect with `intensity` (0–2), and control cursor lenses with `lensSize` and `lensShape` (circle/square).
- **HTML Element Wrapping**: Nest any child node (like buttons, spans, or custom cards) to apply CSS scaling, filters, and dynamic glitch animations on hover.
- **Global Context Provider**: Control and update default lens sizes, shapes, and intensities dynamically using React context.
- **Next.js & SSR Compatible**: Safe hydration, zero client-side load flashes, and fully responsive layouts.

---

## 🚀 Installation

```bash
npm install @alikaner/lensjs
```

Ensure you import the core CSS file once in your application entry point (e.g., `main.tsx`, `App.tsx`, or `_app.tsx`):

```tsx
import '@alikaner/lensjs/styles.css';
```

---

## 📖 Quick Start

```tsx
import { LensImage } from '@alikaner/lensjs/react';
import '@alikaner/lensjs/styles.css';

export default function Banner() {
  return (
    <LensImage
      src="/banner.jpg"
      alt="Interactive Banner"
      effect="glare"
      filter="bladerunner"
      intensity={1.2}
    />
  );
}
```

### Wrapping Custom Elements (e.g. Glitch Buttons)
You can wrap arbitrary text or buttons inside the tag to trigger CSS hover effects (like zoom, filters, glows) and custom text glitch keyframes:

```tsx
import { LensImage } from '@alikaner/lensjs/react';

export default function ActionButton() {
  return (
    <LensImage effect="glitch">
      <button className="primary-btn">
        GLITCH ACTION
      </button>
    </LensImage>
  );
}
```

---

## 🛠️ API Reference

### Props Schema

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `effect` | `LensEffect` | `undefined` | Interactive hover effect (`'glare'`, `'glass'`, `'neon'`, `'invert'`, `'reveal'`, `'glitch'`, `'vortex'`, `'wave'`, etc.). |
| `filter` | `LensFilter` | `undefined` | Cinematic permanent color preset (`'bladerunner'`, `'matrix'`, `'cyberpunk'`, `'dreamy'`, etc.). |
| `revealSrc` | `string` | `undefined` | Image source shown inside the cursor lens boundary when `effect="reveal"`. |
| `intensity` | `number` | `1` | Visual effect strength scalar (`0.0` to `2.0`). |
| `lensSize` | `number` | `130` | Diameter (in pixels) of the circular/square lens mask. |
| `lensShape` | `'circle' \| 'square'`| `'circle'` | Mask frame boundary shape. |
| `children` | `ReactNode` | `undefined` | Wrap custom HTML elements instead of rendering an `<img>` tag. |
| `src`, `alt`, ... | `ImgAttributes` | `undefined` | Standard HTML image properties when rendering images. |

---

## 🎨 Interactive Effects List

### CSS Motion & Framing
*   `zoom`: Smooth scale magnification on hover.
*   `glare`: Silky dynamic light sweep reflection.
*   `glass`: Frosted glass borders, background filters, and soft drop shadow lifts.
*   `blur-vignette`: Center focus with soft blur and a dark vignette ring.
*   `neon`: Glowing shifting border spotlights.
*   `shadow`: Smooth drop shadow lift.
*   `heart-beat`: Rhythmic, elastic scaling pulse.
*   `invert-full`: Inverts colors of the entire image on hover.
*   `tilt-3d`: Perspective card tilt that leans towards the cursor.
*   `ken-burns`: Slow cinematic pan & zoom while hovered.
*   `flip-reveal`: 3D card flip revealing `revealSrc` on the back face.
*   `spotlight`: Cursor-following light beam; the rest fades to black.
*   `scanlines`: Retro CRT/VHS horizontal line overlay.

### Cursor Lens Masking
*   `invert`: Cursor-following lens that inverts all colors beneath it.
*   `reveal`: Double exposure — `revealSrc` shows through the cursor lens.
*   `magnify`: Classic e-commerce magnifying glass zoom under the cursor.
*   `blur-lens`: The image blurs on hover while the lens stays sharp (focus ring).
*   `grayscale-lens`: Black & white image; true colors show through the lens.

### Canvas Pixel Processing (real per-pixel image processing)
*   `glitch`: High-frequency RGB channel separations and displaced raster slices.
*   `vortex`: Twisting whirlpool coordinate distortion around the center.
*   `wave`: Rolling fluid water wave displacement ripples.
*   `fisheye`: Wide-angle barrel bulge magnifying the center.
*   `noise`: Live animated analog film grain.
*   `pixelate`: Growing mosaic blocks.
*   `denoise`: Gaussian smoothing that softens grain and artifacts.
*   `resolution-boost`: Unsharp-mask sharpening for crisper perceived detail.
*   `chromatic-aberration`: Radial RGB channel displacement.
*   `halftone`: Retro newspaper dot-matrix shading.
*   `posterize`: Flat color binning.
*   `melt`: Liquid vertical pixel drip animation.

> **CORS note:** canvas effects must read pixel data. Images from another domain need CORS enabled on the server (LensJS requests them with `crossOrigin="anonymous"` automatically). If pixel access is blocked, the effect silently stays off and the image renders normally.

---

## 🔬 Core API — use the pixel filters anywhere

All canvas filters are exported as pure, framework-agnostic functions operating on raw RGBA buffers (`PixelData` is structurally compatible with canvas `ImageData`). You can run them in your own canvas pipelines, web workers, or Node:

```ts
import { applyVortex, applyHalftone, type PixelData } from '@alikaner/lensjs';

const ctx = canvas.getContext('2d')!;
const src = ctx.getImageData(0, 0, canvas.width, canvas.height);
const dst = ctx.createImageData(canvas.width, canvas.height);

applyVortex(src, dst, 2.2);           // swirl angle in radians
// applyHalftone(src, dst, 8, 1);     // block size, blend strength
ctx.putImageData(dst, 0, 0);
```

Exported functions: `applyVortex`, `applyNoise`, `applyGlitch`, `applyFisheye`, `applyPixelate`, `applyDenoise`, `applySharpen`, `applyWave`, `applyChromatic`, `applyHalftone`, `applyPosterize`, `applyMelt` — plus their tuning constants (`VORTEX_MAX_STRENGTH`, `NOISE_MAX_AMOUNT`, …).

---

## 🌈 Global Settings & Theme Overrides

Use the `LensProvider` context to configure global defaults across your entire application. This allows you to sync lens bounds, sizes, or shapes dynamically with your app's light/dark mode theme:

```tsx
import { LensProvider, LensImage } from '@alikaner/lensjs/react';
import { useState } from 'react';

function App() {
  const [theme] = useState('dark');

  // Change defaults dynamically based on theme status
  const globalLensConfig = {
    lensSize: theme === 'dark' ? 180 : 130,
    lensShape: theme === 'dark' ? 'square' : 'circle',
    intensity: 1.2
  };

  return (
    <LensProvider value={globalLensConfig}>
      <div className="app-content">
        <LensImage src="/hero.jpg" effect="invert" />
      </div>
    </LensProvider>
  );
}
```

---

## 📄 License

MIT © [Ali Kaner](https://github.com/AliKaner)
