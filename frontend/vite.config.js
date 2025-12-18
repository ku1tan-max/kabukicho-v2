import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 외부 엔진 폴더를 참조하기 위해 필요한 설정 (필요시)
    fs: {
      allow: ['..']
    }
  }
})