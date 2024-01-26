import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rawPlugin from 'vite-raw-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.csv', '**/*.pdb', '**/*.sdf', '**/*.cif', '**/*.pcj', '**/*.xyz', '**/*.mol2'],
  plugins: [
    react(),
    rawPlugin({
      fileRegex: /\.frag$|\.vert$/,
    }),
  ],
  build: {
    assetsInlineLimit: 0,
  },
  server: {
    open: true,
    port: 3001,
    host: true,
  },
  base: '/aims',
});
