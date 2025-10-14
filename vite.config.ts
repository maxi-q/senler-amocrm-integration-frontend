import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, },
  logLevel: "error",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Если хочешь, чтобы @ указывал на папку src
    },
  },
  define: {
    'process.env.VITE_CLIENT_ID': JSON.stringify(process.env.VITE_CLIENT_ID),
    'process.env.VITE_FRONT_URL': JSON.stringify(process.env.VITE_FRONT_URL),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.VITE_SENLER_INTEGRATION_ID': JSON.stringify(process.env.VITE_SENLER_INTEGRATION_ID),
  }
})
