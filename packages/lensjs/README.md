# lensjs

Hover effects, cursor lenses and color filters for images — and any other element — in React. One `LensImage` component, 43 effects, 24 color & blur presets, zero dependencies.

Some effects are plain CSS (zoom, neon, tilt), some are real per-pixel image processing rendered to a canvas overlay (vortex, glitch, fisheye, halftone...). The pixel filters are also exported as standalone functions if you want to use them outside React.

Live demos and full docs: [lensjs on Vercel](https://lensjs-alikaners-projects.vercel.app)

## Install

```bash
npm install @alikaner/lensjs
```

Import the stylesheet once, anywhere in your app (entry point is the usual place):

```tsx
import '@alikaner/lensjs/styles.css';
```

## Usage

```tsx
import { LensImage } from '@alikaner/lensjs/react';
import '@alikaner/lensjs/styles.css';

export default function Banner() {
  return (
    <LensImage
      src="/banner.jpg"
      alt="Interactive banner"
      effect="glare"
      filter="bladerunner"
      intensity={1.2}
    />
  );
}
```

Works in Next.js App Router out of the box; the component is already marked `"use client"`, so you can place it inside server components without wrapping anything.

You can also wrap elements other than images. CSS effects (zoom, neon, tilt-3d, heart-beat...) work on any child; `glitch` falls back to a text-glitch animation. Canvas effects need an actual image, so they stay off in this mode.

```tsx
<LensImage effect="glitch">
  <button className="primary-btn">Launch</button>
</LensImage>
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `effect` | `LensEffect` | – | Hover effect to apply. Full list below. |
| `filter` | `LensFilter` | – | Color grade preset. Always on, combines with any effect. |
| `revealSrc` | `string` | – | Second image for `reveal` (shows through the lens) and `flip-reveal` (card back). |
| `intensity` | `number` | `1` | Effect strength, 0 to 2. 0 disables, 2 doubles. |
| `filterIntensity` | `number` | `1` | Strength multiplier for the blur-family filters (`blur-soft`, `blur`, `blur-heavy`, `liquid-glass`). |
| `lensSize` | `number` | `130` | Lens diameter in px for the cursor lens effects. |
| `lensShape` | `'circle' \| 'square'` | `'circle'` | Lens shape. |
| `children` | `ReactNode` | – | Wrap an element instead of rendering an `<img>`. |
| `src`, `alt`, ... | img attributes | – | Everything a normal `<img>` accepts. |

## Effects

CSS effects:

`zoom`, `glare` (light sweep), `glass` (frosted frame), `blur-vignette`, `neon`, `shadow`, `heart-beat`, `invert-full`, `tilt-3d` (leans toward the cursor), `ken-burns` (slow pan and zoom), `flip-reveal` (3D flip to `revealSrc`), `spotlight` (light beam follows the cursor), `scanlines`

Micro-interactions (great on buttons, cards, sidebar items — anything you wrap):

`pop` (springy overshoot scale), `shake`, `jelly` (squash & stretch), `float` (slow levitation), `sway` (pendulum swing), `press` (tactile push-down), `squeeze`, `rotate`, `pulse-glow` (breathing glow ring, recolor via `--lens-glow-rgb`), `gradient-border` (animated conic-gradient ring), `color-pop` (grayscale until hovered), `blur-focus` (soft focus until hovered), `hue-cycle` (spins through the spectrum)

Cursor lenses (all follow the mouse, sized with `lensSize`):

`invert` (negative colors under the lens), `reveal` (second image under the lens), `magnify` (loupe zoom), `blur-lens` (image blurs, lens stays sharp), `grayscale-lens` (b&w image, color under the lens)

Canvas pixel effects:

`vortex` (swirl), `glitch`, `wave`, `fisheye`, `noise` (animated grain), `pixelate`, `denoise`, `resolution-boost` (unsharp mask; sharpens edges, doesn't invent pixels), `chromatic-aberration`, `halftone`, `posterize`, `melt`

Canvas effects read pixel data, so cross-origin images need CORS on the server. The component requests them with `crossOrigin="anonymous"` on its own. If pixel access is blocked the effect just stays off and the image renders normally.

## Color filter presets

Set with the `filter` prop, inspired mostly by movie color grades:

`bladerunner`, `matrix`, `noir`, `mad-max`, `twilight-1`, `twilight-2`, `twilight-3`, `cyberpunk`, `vintage`, `vintage-high`, `sunset`, `oceanic`, `dreamy`, `amaro`, `duotone-purple`, `duotone-red`, `duotone-cyan`, `grayscale`

Blur family (scaled by `filterIntensity`): `blur-soft`, `blur`, `blur-heavy`, `motion-blur`, `motion-blur-vertical`, `liquid-glass`

## Global defaults

`LensProvider` sets defaults for every `LensImage` under it. Component props still win. Handy for syncing lens settings with a theme:

```tsx
import { LensProvider, LensImage } from '@alikaner/lensjs/react';

function App() {
  return (
    <LensProvider value={{ lensSize: 180, intensity: 1.2 }}>
      <LensImage src="/hero.jpg" effect="invert" />
    </LensProvider>
  );
}
```

### Theme-driven filters

`filter` is part of the provider config too, so one state change re-grades **everything** wrapped in a `LensImage` — images, buttons, whole sidebars. Switch your app to noir mode in one line:

```tsx
import { useState } from 'react';
import { LensProvider, LensImage, type LensFilter } from '@alikaner/lensjs/react';

function App() {
  const [theme, setTheme] = useState<'day' | 'noir'>('day');
  const themeFilter: LensFilter | undefined = theme === 'noir' ? 'noir' : undefined;

  return (
    <LensProvider value={{ filter: themeFilter }}>
      <LensImage effect="press">
        <aside className="sidebar">…</aside>
      </LensImage>
      <LensImage src="/hero.jpg" effect="zoom" />
      <button onClick={() => setTheme(theme === 'noir' ? 'day' : 'noir')}>
        Toggle noir mode
      </button>
    </LensProvider>
  );
}
```

A `filter` prop on an individual `LensImage` still overrides the theme filter.

## Using the pixel filters directly

Every canvas filter is a pure function over raw RGBA buffers, no React involved. `PixelData` is structurally the same as canvas `ImageData`, so this works in your own canvas code, web workers or Node:

```ts
import { applyVortex } from '@alikaner/lensjs';

const ctx = canvas.getContext('2d');
const src = ctx.getImageData(0, 0, canvas.width, canvas.height);
const dst = ctx.createImageData(canvas.width, canvas.height);

applyVortex(src, dst, 2.2); // swirl angle in radians
ctx.putImageData(dst, 0, 0);
```

Available: `applyVortex`, `applyNoise`, `applyGlitch`, `applyFisheye`, `applyPixelate`, `applyDenoise`, `applySharpen`, `applyWave`, `applyChromatic`, `applyHalftone`, `applyPosterize`, `applyMelt`.

## Styling

The wrapper gets a `.lens-image-wrapper` class plus `data-lens-effect` / `data-lens-filter` attributes, so everything is overridable from your own CSS. Lens position and size are exposed as `--lens-x`, `--lens-y` and `--lens-size` custom properties.

To respect reduced-motion preferences, one rule in your stylesheet is enough:

```css
@media (prefers-reduced-motion: reduce) {
  .lens-image-wrapper, .lens-image-wrapper * {
    animation: none !important;
    transition: none !important;
  }
}
```

## License

MIT © [Ali Kaner](https://github.com/AliKaner)
