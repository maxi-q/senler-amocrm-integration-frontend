import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5553, },
  logLevel: "error",
  define: {
    'process.env.VITE_CLIENT_ID': JSON.stringify(process.env.VITE_CLIENT_ID),
    'process.env.VITE_REDIRECT_URI': JSON.stringify(process.env.VITE_REDIRECT_URI),
  }
})
