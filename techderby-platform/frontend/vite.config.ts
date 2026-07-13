import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const proxyTarget = process.env.VITE_PROXY_TARGET ?? 'http://localhost:1337';

export default defineConfig({
  plugins: [react()],
  // @huggingface/transformers ships ESM workers and the ONNX runtime; do not
  // let Vite pre-bundle it.
  optimizeDeps: {
    exclude: ['@huggingface/transformers'],
  },
  server: {
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
});
