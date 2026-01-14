import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { fileURLToPath, URL } from 'node:url';
import svgr from 'vite-plugin-svgr';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    paraglideVitePlugin({
      cookieName: 'lang',
      project: './project.inlang',
      outdir: './src/paraglide',
      strategy: ['cookie', 'localStorage', 'preferredLanguage', 'baseLocale']
    }),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteReact({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
    tailwindcss(),
    svgr()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
