import { defineConfig } from 'vite'

export default defineConfig({
   build: {
     manifest: true,
     rollupOptions: {
       input: 'index.js',
     },
   },
 })
