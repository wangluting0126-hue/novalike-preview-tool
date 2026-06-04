import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Use relative base so the build works on GitHub Pages (served under /<repo>/)
  base: './',
  plugins: [react(), tailwindcss()],
})
