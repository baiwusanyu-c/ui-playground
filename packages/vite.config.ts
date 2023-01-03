import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from '@unocss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { viteStaticCopy } from 'vite-plugin-static-copy'
const pkgPath = resolve(__dirname, 'index.ts')
export default defineConfig({
  plugins: [
    react(),
    Unocss(),
    visualizer(),
    viteStaticCopy({
      targets: [
        {
          src: './package.json',
          dest: '../dist',
        },
      ],
    }),
  ],
  server: {
    host: true,
  },
  optimizeDeps: {
    exclude: [
      'react',
      'react-dom',
      'prop-types',
      '@iconify/utils/lib/loader/fs',
      '@iconify/utils/lib/loader/install-pkg',
      '@iconify/utils/lib/loader/node-loader',
      '@iconify/utils/lib/loader/node-loaders',
    ],
  },
  build: {
    target: 'esnext',
    outDir: '../dist',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: pkgPath,
      name: 'ui-playground',
      // the proper extensions will be added
      fileName: 'ui-playground',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        'prop-types',
        'react',
        'react-dom',
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
        },
      },
    },
  },
})
