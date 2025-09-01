import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'src'),
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    port: 5173,
    open: true,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: ['5173-ibz7kyf3x5pshyom2cbrm-89af857f.manusvm.computer', 'all'],
    historyApiFallback: true,
    hmr: {
      clientPort: 5173,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src', 'index.html'),
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@componentes': path.resolve(__dirname, 'src/componentes'),
      '@servicos': path.resolve(__dirname, 'src/servicos'),
      '@config': path.resolve(__dirname, 'config'),
      '@paginas': path.resolve(__dirname, 'src/paginas'),
      '@recursos': path.resolve(__dirname, 'src/recursos'),
      '@ganchos': path.resolve(__dirname, 'src/ganchos'),
      '@contextos': path.resolve(__dirname, 'src/contextos'),
      '@auth': path.resolve(__dirname, 'src/componentes/auth'),
      '@formularios': path.resolve(__dirname, 'src/componentes/formularios'),
      '@layout': path.resolve(__dirname, 'src/componentes/layout'),
      '@perfil': path.resolve(__dirname, 'src/componentes/perfil'),
      '@comum': path.resolve(__dirname, 'src/componentes/comum'),
      '@acessibilidade': path.resolve(__dirname, 'src/componentes/acessibilidade'),
      '@estilos': path.resolve(__dirname, 'src/estilos'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
});

