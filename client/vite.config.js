import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      apply: 'post',
      enforce: 'post',
      transformIndexHtml() {
        return [
          {
            tag: 'link',
            attrs: { rel: 'stylesheet', href: '/src/index.css' },
            injectTo: 'head',
          },
        ]
      },
    },
  ],
})
