// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: [
      '5173-io6xxoptpwnfhzx6r5qy5-fab2df20.manusvm.computer'
    ]
  }
})