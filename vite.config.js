import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base для GitHub Pages подставляется в CI из имени репозитория
// (VITE_BASE=/<repo>/ в .github/workflows/deploy.yml). Локально и в dev — '/'.
// Бандлённый контент (glob ?raw) и ассеты (glob ?url) учитывают base автоматически,
// поэтому руками BASE_URL нигде прописывать не нужно.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
