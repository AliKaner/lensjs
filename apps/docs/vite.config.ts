import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the static build works from any host or subpath
  // (Vercel, Netlify, GitHub Pages /lensjs/, local file preview…)
  base: './',
  build: {
    // Emit to the monorepo root so Vercel finds "dist" regardless of
    // which directory the build command runs from
    outDir: '../../dist',
    emptyOutDir: true,
  },
  plugins: [react()],
})
