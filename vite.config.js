import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: true, // 或 'inline'
  },
  server: {
    sourcemap: true, // 开发环境也建议开启
  }
})
