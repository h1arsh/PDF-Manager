import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/css/variables.scss";`
      }
    }
  }
})