import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Builds the package consumers import: dist-lib/ecom-ui-kit.js + dist-lib/styles.css.
// React stays external (peer dependency).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Keep the development warnings alive in the consumer's own dev builds:
  // their bundler replaces process.env.NODE_ENV, and production builds drop the warnings.
  define: { 'import.meta.env.DEV': "(process.env.NODE_ENV !== 'production')" },
  build: {
    outDir: 'dist-lib',
    emptyOutDir: true,
    lib: { entry: 'src/library/entry.js', formats: ['es'], fileName: 'ecom-ui-kit', cssFileName: 'styles' },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
  },
})
