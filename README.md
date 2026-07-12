# lensjs

Monorepo for [`@alikaner/lensjs`](https://www.npmjs.com/package/@alikaner/lensjs), a React component that adds hover effects, cursor lenses and color filters to images, plus its documentation site.

- `packages/lensjs` – the npm package. Component, effect styles, pixel filters, tests. See its [README](packages/lensjs/README.md) for usage.
- `apps/docs` – docs and sandbox site (Vite + React), deployed on Vercel.

The docs site consumes the package through the workspace, so everything you see there runs on the exact code that ships to npm.

## Development

```bash
npm install
npm run dev:docs     # docs site with live preview of all effects
npm test             # package tests (vitest)
npm run build        # builds the package, then the site
```

The site imports the package's built `dist`, so after changing package source run `npm run build:lib` first (the docs build script already does this for you).

## Adding an effect

1. CSS-only effects: add the id to `LensEffect` in `packages/lensjs/src/types.ts` and a rule in `packages/lensjs/styles.css`.
2. Pixel effects: write a pure function in `packages/lensjs/src/effects/`, register it in `canvasRenderers` in `src/react.tsx`, and add the effect to the `position: relative` selector list in `styles.css`.
3. Either way, add the effect to the sandbox list in `apps/docs/src/App.tsx`.

The style test suite fails if an effect has no CSS rule, so step 1 is hard to forget.

## Publishing

Bump the version in `packages/lensjs/package.json` and the `version` export in `src/index.ts` (a test keeps them in sync), then:

```bash
npm publish --workspace packages/lensjs
```

`prepublishOnly` runs the build, and `publishConfig` already handles public access for the scoped name.

## License

MIT © [Ali Kaner](https://github.com/AliKaner)
