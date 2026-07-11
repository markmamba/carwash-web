import path from 'path'
import { fileURLToPath } from 'url'
import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'

const projectRootPath = path.dirname(fileURLToPath(import.meta.url))
const appDirPath      = path.resolve(projectRootPath, 'app')

export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  plugins: [
    reactRouter()
  ],
  resolve: {
    alias: {
      '@': appDirPath
    }
  }
})
