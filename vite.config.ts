import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative asset paths: GitHub Pages serves the site under the repository
// name, and the HashRouter keeps every page on the same document.
export default defineConfig({
  base: './',
  plugins: [react()],
})
