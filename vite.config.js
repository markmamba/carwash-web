import path from 'path'
import { fileURLToPath } from 'url'
import { reactRouter } from '@react-router/dev/vite'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'

const projectRootPath     = path.dirname(fileURLToPath(import.meta.url))
const appDirPath          = path.resolve(projectRootPath, 'app')
const bootstrapDirPath    = path.resolve(projectRootPath, 'node_modules/bootstrap')
const customStylesDirPath = path.resolve(projectRootPath, 'app/styles')

export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  css: {
    devSourcemap        : true,
    preprocessorOptions : {
      scss: {
        quietDeps           : true,
        api                 : 'modern-compiler',
        silenceDeprecations : ['import']
      }
    },
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            'last 2 versions',
            '> 1%',
            'not dead'
          ]
        })
      ]
    }
  },
  plugins: [
    reactRouter()
  ],
  resolve: {
    alias: {
      '@'          : appDirPath,
      '~bootstrap' : bootstrapDirPath,
      '~styles'    : customStylesDirPath
    }
  }
})
