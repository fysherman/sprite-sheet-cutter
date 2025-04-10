import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/sprite-sheet-cutter/',
  plugins: [
    tailwindcss(),
  ],
})