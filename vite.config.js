import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5180,        // 5173 reserved for the Balagency CRM
    strictPort: true,  // fail fast if 5180 is busy (don't silently bump to 5181)
    host: true,        // listen on 0.0.0.0 so the iPhone can reach it over LAN
  },
})
