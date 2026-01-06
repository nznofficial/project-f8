import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/laps': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
      '/pit-stops': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    },
  },
})
