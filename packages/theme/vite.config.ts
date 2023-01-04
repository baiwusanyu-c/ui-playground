import { resolve } from 'path'
import fs from 'fs'
import { defineConfig } from 'vite'
const pkgPath = resolve(__dirname, 'src/index.scss')
function delPlugin(
  config: {
    outDir: string
    deleteFile: Array<string | RegExp>
  }) {
  return {
    name: 'rollup-plugin-delete',
    closeBundle() {
      fs.readdir(config.outDir, (error, data) => {
        if (error) {
          console.log(error)
          return false
        }
        const delFile: Array<string> = []
        config.deleteFile.forEach((value: string | RegExp) => {
          data.forEach((fileName) => {
            if (typeof value === 'string' && fileName === value) {
              delFile.push(fileName)
            } else {
              if ((value as RegExp).test(fileName))
                delFile.push(fileName)
            }
          })
        })

        delFile.forEach((value) => {
          fs.unlink(`${config.outDir}/${value}`, (error) => {
            if (error) {
              console.log(error)
              return false
            }
            console.log(`Delete file *********-> ${value}`)
          })
        })
      })
    },
  }
}
export default defineConfig({
  plugins: [
    delPlugin({
      outDir: '../../dist/theme',
      deleteFile: [/index/],
    }),
  ],
  build: {
    target: 'esnext',
    outDir: '../../dist/theme',
    lib: {
      entry: pkgPath,
      name: 'index',
      fileName: 'index',
    },
  },
})
