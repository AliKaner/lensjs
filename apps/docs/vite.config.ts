import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the static build works from any host or subpath
  // (Vercel, Netlify, GitHub Pages /lensjs/, local file preview…)
  base: './',
  plugins: [react()],
})
