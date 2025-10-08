import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "."),
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    port: 5173,
    open: true,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: ['5173-iwnktope84q4hpntmr0kr-531a31c1.manusvm.computer', 'all'],
    historyApiFallback: true,
    hmr: {
      clientPort: 5173,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // CORREÇÃO: mudado de 3000 para 3001
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔄 Proxy Request:', req.method, req.url);
          });
        }
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/Index.html',
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  resolve: {    alias: {
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
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
});