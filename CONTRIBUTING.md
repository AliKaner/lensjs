# Contributing

Thanks for taking the time. Issues and PRs are welcome, small ones especially.

## Setup

You need Node 20+ and npm (the repo uses npm workspaces).

```bash
git clone https://github.com/AliKaner/lensjs.git
cd lensjs
npm install
npm run dev:docs    # docs + sandbox at localhost:5173
```

The sandbox is the fastest way to see your changes: it runs on the package's built output, exactly what ships to npm.

## Layout

```
packages/lensjs      the npm package
  src/react.tsx      LensImage component, LensProvider, canvas renderer registry
  src/effects/       pure pixel filters (one file per effect)
  src/types.ts       LensEffect / LensFilter unions
  styles.css         all effect CSS, shipped as @alikaner/lensjs/styles.css
  tests/             vitest suites
apps/docs            documentation site (Vite + React)
```

Heads up: the docs site imports the package's `dist`, not its source. After touching package code, rebuild it (`npm run build:lib` from the root) or just use the docs build script, which does it for you.

## Adding an effect

**CSS effect** (hover transforms, overlays):

1. Add the id to `LensEffect` in `packages/lensjs/src/types.ts`.
2. Add a rule in `packages/lensjs/styles.css` targeting `[data-lens-effect="your-id"]`. Wire the strength to `var(--lens-intensity, 1)` so the `intensity` prop works.

**Pixel effect** (real image processing):

1. Write a pure function in `src/effects/your-effect.ts` operating on `PixelData` (same shape as canvas `ImageData`). It must be an identity at zero strength and must not touch the source buffer.
2. Export it from `src/effects/index.ts` and register it in `canvasRenderers` in `src/react.tsx`. Set `continuous: true` only if it needs to re-render every frame while hovered (like grain or glitch).
3. Add the effect id to the `position: relative` selector list in `styles.css`.

**Both:** add the effect to the sandbox list in `apps/docs/src/App.tsx` so people can try it, and to the effect table in the docs section.

## Tests

```bash
npm test
```

What the suites cover, so you know where new assertions belong:

- `effects.test.ts` – pixel filters: identity at zero, changes at full strength, source untouched, seed determinism.
- `styles.test.ts` – every effect and filter id must have a CSS rule. This fails automatically if you forget the stylesheet.
- `react.test.tsx` – SSR rendering of the component, props, provider inheritance.
- `package.test.ts` – release sanity: exports point at real files, CSS ships, react stays a peer dep.

Please keep tests green and add coverage for new effects. No snapshot tests, keep assertions explicit.

## PRs

- One effect or fix per PR is easiest to review.
- Run `npm test` and `npm run build` before pushing.
- If you change public API (props, exports, effect ids), update both READMEs and the docs site in the same PR.
- Renaming or removing an existing effect id is a breaking change; open an issue first.

## Publishing

Maintainer-only. Bump the version in `packages/lensjs/package.json` and the `version` export in `src/index.ts` (a test enforces the sync), then `npm publish --workspace packages/lensjs`.
