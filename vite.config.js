import SassGlob from 'vite-plugin-sass-glob-import';
import { defineConfig } from 'vite';
import { sync } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import { imageOptimizerPlugin } from './vite-plugins/image-optimizer';
import { removeAttributes } from './vite-plugins/removeAttributes';
import path from 'path';

export default defineConfig({
  plugins: [
    injectHTML(),
    SassGlob(),
    imageOptimizerPlugin(),
    removeAttributes(),
  ],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@helpers': path.resolve(__dirname, 'src/styles/helpers'),
      '@sections': path.resolve(__dirname, 'src/sections'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@js': path.resolve(__dirname, 'src/js'),
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
  base: '',
});
