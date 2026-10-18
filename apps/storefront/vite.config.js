import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // `file:../..` links the kit from this repository, which has its own node_modules, so a second React
  // would be bundled. With a registry install or a packed tarball there is one React and this can go.
  resolve: { dedupe: ['react', 'react-dom'] },
})
