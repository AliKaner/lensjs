# 📷 @alikaner/lensjs

A lightweight, high-performance interactive image visual effects wrapper for React and Next.js applications. Apply glassmorphic glare sweeps, shifting neon borders, cursor-following color inverters, double-exposure image reveals, and 12+ animated canvas filter shaders with a simple declarative JSX tag.

Now supports **arbitrary HTML elements** wrapping (e.g. glitching buttons, glowing text, glassmorphic cards) and **dynamic configuration themes**!

---

## ✨ Features

- **Zero-Dependency Core**: Lightweight footprint driven by high-performance CSS transforms and vanilla Canvas pixel shaders.
- **16 Interactive Hover Effects**: Including Reflection Glare, Frosted Glass, Neon Spotlight, Invert Mask, Double Exposure Reveal, VHS Glitch, Fluid Wave, Swirl Vortex, Halftone, Posterize, and Melt.
- **18 Movie-Inspired Filter Presets**: Permanent cinematic color grades (Blade Runner, Matrix, Cyberpunk, Twilight, Noir, Sunset, Duotones, and Bloom) that compose seamlessly with hover effects.
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

### CSS-Driven Effects
*   `zoom`: Smooth scale magnification on hover.
*   `glare`: Silky dynamic light sweep reflection.
*   `glass`: Frosted glass borders, background filters, and soft drop shadow lifts.
*   `neon`: Glowing shifting border spotlights.
*   `shadow`: Smooth drop shadow lift.
*   `heart-beat`: Rhythmic, elastic scaling pulse.
*   `invert-full`: Inverts colors of the entire image on hover.

### Cursor Lens Masking
*   `invert`: Renders a cursor-following magnifying frame that inverts all pixel values beneath it.
*   `reveal`: Blends two images (double exposure), revealing `revealSrc` inside the cursor lens bounds.

### Canvas Shader Shaders (Raster Pixel distortion)
*   `glitch`: High-frequency RGB color channel separations and horizontal raster line displacements.
*   `vortex`: Twisting whirlpool coordinate distortion centered at your mouse cursor.
*   `wave`: Rolling fluid water wave displacement ripples.
*   `chromatic-aberration`: RGB channel color displacement.
*   `halftone`: Retro newspaper dot-matrix shading.
*   `posterize`: Flat color binning.
*   `melt`: Liquid vertical pixel drip animation.

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
