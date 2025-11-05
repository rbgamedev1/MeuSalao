import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'giovanny-plantable-olen.ngrok-free.dev'
  ],
    host: true,
  },
})
