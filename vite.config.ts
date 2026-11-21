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
        // Function form (not the object form) so shared helpers such as
        // rollup's commonjs/babel helpers are NOT hoisted into the 3D chunks —
        // otherwise the main bundle imports from them and the whole three.js
        // payload gets preloaded on phones that never render the 3D hero.
        manualChunks(id) {
          // Vite's preload helper / rollup virtual helpers belong in an eager chunk.
          if (id.startsWith('\0vite/') || id === '\0commonjsHelpers.js') return 'react'
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          if (/[\\/]node_modules[\\/]three[\\/]/.test(id)) return 'three'
          if (/[\\/]node_modules[\\/](@react-three|postprocessing|three-stdlib|maath|camera-controls|troika|meshline|zustand|its-fine|suspend-react)/.test(id))
            return 'r3f'
          if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils|gsap)[\\/]/.test(id)) return 'motion'
          return undefined
        },
      },
    },
  },
})
