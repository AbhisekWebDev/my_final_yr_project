import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// to use tailwind with vite
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
