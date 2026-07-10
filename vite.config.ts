import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// The base path defaults to "/"; CI overrides it with --base for GitHub Pages.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
