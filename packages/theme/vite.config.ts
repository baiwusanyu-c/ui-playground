import { resolve } from 'path'
import { defineConfig } from 'vite'
const pkgPath = resolve(__dirname, 'src/index.scss')
const themePath = resolve(__dirname, 'src/theme.scss')
export default defineConfig({
  plugins: [
    {
      name: 'test-plugin',
      async resolveDynamicImport(specifier, importer) {
        // console.log(specifier, importer)
        /* let transBundle:any = {}
        Object.keys(bundle).forEach(value => {
          let name = value.split('.')[0] + '.' + value.split('.')[2]
          transBundle[name] = {
            ...bundle[value]
          }
          transBundle[name].fileName = name
          transBundle[name].isAsset = true
        })

        bundle = transBundle */
      },
    },
  ],
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
