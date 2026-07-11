import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the static build works from any host or subpath
  // (Vercel, Netlify, GitHub Pages /lensjs/, local file preview…)
  base: './',
  resolve: {
    // Guarantee a single React copy in the bundle even if a workspace
    // package pulls in its own nested react
    dedupe: ['react', 'react-dom'],
  },
  plugins: [react()],
})
