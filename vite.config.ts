import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';


export default defineConfig({
  plugins: [
    tailwindcss(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      outputStructure: 'message-modules',
      cookieName: 'locale',
      strategy: ['cookie', 'localStorage', 'preferredLanguage', 'baseLocale'],
    }),
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
    svgr()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
