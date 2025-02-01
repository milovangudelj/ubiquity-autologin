import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        },
      ],
    }),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        extra: './src/autofill/index.ts',
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'extra') {
            return 'autofill/index.js' // Custom folder for the extra file
          }
          return '[name].js'
        },
      },
    },
  },
})
