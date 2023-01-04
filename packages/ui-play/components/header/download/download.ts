import { saveAs } from 'file-saver'

// @ts-expect-error amazing ts error
import index from './template/index.html?raw'
// @ts-expect-error amazing ts error
import main from './template/main.js?raw'
// @ts-expect-error amazing ts error
import pkg from './template/package.json?raw'
// @ts-expect-error amazing ts error
import config from './template/vite.config.js?raw'
// @ts-expect-error amazing ts error
import readme from './template/README.md?raw'
import type { fileStore } from '../../../store/file'

export async function downloadProject(store: typeof fileStore) {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()

  // basic structure
  zip.file('index.html', index)
  zip.file('package.json', pkg)
  zip.file('vite.config.js', config)
  zip.file('README.md', readme)

  // project src
  const src = zip.folder('src')!
  src.file('main.js', main)
  const files = store.files
  for (const file in files)
    src.file(file, files[file].code)

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, 'vue-project.zip')
}
