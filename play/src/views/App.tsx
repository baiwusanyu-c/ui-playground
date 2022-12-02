import '../assets/scss/App.css'
import { PlayGround, getPlayPreset } from 'ui-playground-pkg'

const playConfig = getPlayPreset('vue')

playConfig.headerOption.useVersion = true
playConfig.headerOption.uiVersionLink = 'https://data.jsdelivr.com/v1/package/npm/ant-design-vue'
playConfig.headerOption.uiMinVersion = '3.0.0'
playConfig.headerOption.logo = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
playConfig.headerOption.title = 'Antd Vue'

playConfig.importMap.push({
  name: 'element-plus',
  pkgName: 'element-plus',
  indexPath: '/dist/index.full.min.mjs',
  type: 'ui',
})
playConfig.mainFile.code = '<script setup>\n' +
  'import { ref, version as vueVersion } from \'vue\'\n' +
  'import { version as EpVersion,ElInput} from \'element-plus\'\n' +
  'const msg = ref(\'Hello World!\')\n' +
  '</script>\n' +
  '\n' +
  '<template>\n' +
  '  <h1>{{ msg }}</h1>\n' +
  '  <el-input v-model="msg" />\n' +
  '\n' +
  '  <p>\n' +
  ' \n' +
  '    Element Plus {{ EpVersion }} + Vue {{ vueVersion }}\n' +
  '  </p>\n' +
  '</template>'

const App = () => {
  return (
    <div className="App">
      <PlayGround config={playConfig} />
    </div>
  )
}

export default App
