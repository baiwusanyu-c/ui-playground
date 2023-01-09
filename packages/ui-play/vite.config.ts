import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from '@unocss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import fs from 'fs-extra'
import type { PluginOption } from 'vite'
const indexPath = resolve(__dirname, 'index.ts')
const transformPkgJson = () => {
  let isTransform = false
  return {
    name: 'ui-playgroun-plugin',
    async writeBundle() {
      if(!isTransform){
        const indexPath = resolve(__dirname, 'package.json')
        const pkgContent = await fs.readJson(indexPath)
        pkgContent.main = "./src/index.js"
        pkgContent.module = "./src/index.js"
        pkgContent.types = "./types/packages/index.d.ts"
        pkgContent.style = "./theme/style.css"
        pkgContent.exports = {
          ".": {
            "type": "./types/packages/index.d.ts",
            "import": "./src/index.js",
            "require": "./src/index.umd.cjs"
          },
          "./theme/style.css": "./theme/style.css"
        }

        await fs.writeJSON(resolve('../../dist/package.json'), pkgContent, { spaces: 2 })
        isTransform = true
      }
    },
  }
}
export default defineConfig({
  plugins: [
    react(),
    Unocss(),
    viteStaticCopy({
      targets: [
        {
          src: './type/types',
          dest: '../dist/types',
        },
      ],
    }),
    transformPkgJson() as PluginOption,
  ],
  server: {
    host: true,
  },
  optimizeDeps: {
    exclude: [
      'react',
      'react-dom',
      'prop-types',
      '@iconify/utils',
      '@iconify/utils/lib/loader/fs',
      '@iconify/utils/lib/loader/install-pkg',
      '@iconify/utils/lib/loader/node-loader',
      '@iconify/utils/lib/loader/node-loaders',
    ],
  },
  build: {
    target: 'esnext',
    outDir: '../../dist/src',
    lib: {
      entry: indexPath,
      name: 'index',
      fileName: 'index',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        'prop-types',
        'react',
        'react-dom',
        '@iconify/utils',
        '@iconify/utils/lib/loader/fs',
        '@iconify/utils/lib/loader/install-pkg',
        '@iconify/utils/lib/loader/node-loader',
        '@iconify/utils/lib/loader/node-loaders',
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          'react': 'react',
          'prop-types': 'prop-types',
          'react-dom': 'react-dom',
          '@iconify/utils': '@iconify/utils',
        },
      },
    },
  },
})
