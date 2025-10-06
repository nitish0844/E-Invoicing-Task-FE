import path from 'path';
import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const { publicVars } = loadEnv({ prefixes: ['VITE_'] });

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: './index.html',
  },
  source: {
    define: publicVars,
    entry: {
      index: './src/main.js',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Uncomment these if you need them:
      // '@assets': path.resolve(__dirname, './src/assets'),
      // '@components': path.resolve(__dirname, './src/components'),
      // '@stores': path.resolve(__dirname, './src/store'),
      // '@pages': path.resolve(__dirname, './src/pages'),
      // '@constants': path.resolve(__dirname, './src/constants'),
      // '@api': path.resolve(__dirname, './src/api'),
    },
  },
  server: {
    port: 3001,
  },

  output: {
    sourceMap: true
  },
});