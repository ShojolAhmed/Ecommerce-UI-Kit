import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Only needed because `file:../..` links the kit from this repo (it has its own node_modules).
  // With a registry install or a packed tarball there is a single React and this line can go.
  resolve: { dedupe: ['react', 'react-dom'] },
})
