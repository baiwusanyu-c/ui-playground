import { resolve } from 'path'
import { defineConfig } from 'vite'
const pkgPath = resolve(__dirname, 'src/index.scss')
const themePath = resolve(__dirname, 'src/theme.scss')
export default defineConfig({
  build: {
    target: 'esnext',
    outDir: '../../dist/theme',
    cssCodeSplit: true,
    assetsDir: './',
    lib: {
      entry: {
        style: pkgPath,
        theme: themePath,
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        assetFileNames: (AssetInfo) => {
          return AssetInfo.name?.split('/')[1] || ''
        },
      },
    },
  },
})
