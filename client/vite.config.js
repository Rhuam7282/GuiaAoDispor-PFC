// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Adicione esta seção de servidor
  server: {
    proxy: {
      // Redireciona requisições que começam com /api para o seu servidor backend
      '/api': {
        target: 'http://localhost:3000', // A porta do seu servidor Express
        changeOrigin: true, // Necessário para virtual hosts
        secure: false,      // Não verificar certificado SSL (para desenvolvimento)
      }
    }
  }
})