// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- IMPORTADO

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- ADICIONADO
  ],
})