import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the same build works on a web host and inside a Tauri window.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173, strictPort: true },
})
