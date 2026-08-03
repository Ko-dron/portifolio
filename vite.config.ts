import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // If deploying to a GitHub project page (username.github.io/<repo>),
  // uncomment and set the base to '/<repo>/'. Root domains / Vercel / Netlify
  // should leave this as '/'.
  // base: '/portfolio/',
  base: '/',
  build: {
    target: 'es2020',
    // three.js is inherently large; it lives in its own lazy chunk loaded only
    // for the 3D hero, so raise the advisory limit above its size.
    chunkSizeWarningLimit: 900,
    // Split the heavy 3D + animation libraries out of the main bundle so the
    // initial payload stays lean and the vendor chunks cache independently.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          motion: ['framer-motion', 'gsap'],
        },
      },
    },
  },
})
