import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',          // ใช้ได้กับทุกชื่อ repo
  plugins: [react()],
})
