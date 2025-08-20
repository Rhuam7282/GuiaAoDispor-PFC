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
    host: true,
    historyApiFallback: true,
    hmr: {
      clientPort: 5173,
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src', 'index.html')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@componentes': path.resolve(__dirname, 'src/componentes'),
      '@servicos': path.resolve(__dirname, 'src/servicos'),
      '@config': path.resolve(__dirname, 'config'),
      '@paginas': path.resolve(__dirname, 'src/paginas'),
      '@recursos': path.resolve(__dirname, 'src/recursos')
    }
  }
});