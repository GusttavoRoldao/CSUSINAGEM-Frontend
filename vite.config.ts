import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/customers': 'http://localhost:3333',
      '/customer': 'http://localhost:3333'
    }
  }
})
