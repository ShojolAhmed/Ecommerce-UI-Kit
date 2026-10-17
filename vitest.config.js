import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Component behaviour tests (jsdom). The library entry is style-free, so no Tailwind plugin is needed here.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx}'],
  },
})
