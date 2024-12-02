import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    global: {}, // Voeg een lege global toe
  },
  server: {
    port: 5174, // Gebruik een poort naar keuze
  },
})