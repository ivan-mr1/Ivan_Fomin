import SassGlob from 'vite-plugin-sass-glob-import';
import { defineConfig } from 'vite';
import { sync } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import { imageOptimizerPlugin } from './vite-plugins/image-optimizer';
import { removeAttributes } from './vite-plugins/removeAttributes';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    injectHTML(),
    SassGlob(),
    imageOptimizerPlugin(),
    removeAttributes(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/shared/assets', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/app/styles', import.meta.url)),
      '@helpers': fileURLToPath(
        new URL('./src/app/styles/helpers', import.meta.url),
      ),
    },
  },
  build: {
    rollupOptions: {
      input: sync('src/**/!(_)*.html'.replace(/\\/g, '/')),
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name;
          if (/css/.test(extType)) {
            extType = 'assets/css';
          }
          return assetInfo.originalFileName ?? `${extType}/[name][extname]`;
        },
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
      },
    },
    assetsInlineLimit: 0,
    emptyOutDir: true,
    outDir: '../dist',
  },
  root: 'src',
  base: process.env.NODE_ENV === 'production' ? '/Ivan_Fomin/' : '',
});
