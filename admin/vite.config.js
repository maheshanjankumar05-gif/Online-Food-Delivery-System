import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone Vercel deployment uses '/', unified Express/Render uses '/admin/'
const base = process.env.VERCEL ? '/' : (process.env.VITE_BASE || '/admin/');

export default defineConfig({
  base: base,
  plugins: [react()],
})
