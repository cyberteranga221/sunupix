/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  worker: {
    // Les workers sont des modules ES : imports dynamiques possibles (décodeur HEIC paresseux).
    format: 'es',
  },
  build: {
    target: 'es2022',
    // Le .wasm de libheif ne doit jamais être inliné en base64.
    assetsInlineLimit: (file) => (file.endsWith('.wasm') ? false : undefined),
  },
  test: {
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    environment: 'node',
  },
});
