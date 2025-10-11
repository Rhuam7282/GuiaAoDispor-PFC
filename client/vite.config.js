import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    port: 5173,
    open: true,
    strictPort: false,
    host: true,
    cors: true,
    hmr: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@Componentes': path.resolve(__dirname, 'src/Componentes'),
      '@Servicos': path.resolve(__dirname, 'src/Servicos'),
      '@Config': path.resolve(__dirname, 'src/Config'),
      '@Paginas': path.resolve(__dirname, 'src/Paginas'),
      '@Recursos': path.resolve(__dirname, 'src/Recursos'),
      '@Ganchos': path.resolve(__dirname, 'src/Componentes/Acessibilidade/Ganchos'),
      '@Contextos': path.resolve(__dirname, 'src/Contextos'),
      '@Autenticacao': path.resolve(__dirname, 'src/Componentes/Autenticacao'),
      '@Formularios': path.resolve(__dirname, 'src/Componentes/Formularios'),
      '@Layout': path.resolve(__dirname, 'src/Componentes/Layout'),
      '@Perfil': path.resolve(__dirname, 'src/Componentes/Perfil'),
      '@Comum': path.resolve(__dirname, 'src/Componentes/Comum'),
      '@Acessibilidade': path.resolve(__dirname, 'src/Componentes/Acessibilidade'),
      '@Estilos': path.resolve(__dirname, 'src/Estilos'),
      '@Utils': path.resolve(__dirname, 'src/Utils')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});