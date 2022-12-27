import { createGenerator } from 'unocss'
// @ts-expect-error get raw
import defaultConfigRaw from './unocss.config.ts?raw'
import { evaluateUserConfig } from './evaluate-user-config'
import type { UserConfig } from 'unocss'

let defaultConfig: UserConfig | undefined = {}

async function load() {
  try {
    defaultConfig = await evaluateUserConfig(defaultConfigRaw)
  } catch (e) {
    console.error(e)
  }
}

async function generate(html: string, cb: Function) {
  const compilerInjectUnocss = createGenerator({}, defaultConfig)
  const output = await compilerInjectUnocss.generate(html || '')
  cb(output.css)
}

export async function compilerUNOCSS(iframeElm: HTMLIFrameElement) {
  await load()
  const iframeWin = iframeElm.contentWindow
  if (iframeWin) {
    const iframeWinContainer = iframeWin.document.getElementById('app')
    const innerHTML = iframeWinContainer ? iframeWinContainer.innerHTML : ''
    await generate(innerHTML, (css: string) => {
      const iframeWinStyle = iframeWin.document.getElementById('play_styles')
      if (iframeWinStyle)
        iframeWinStyle.innerHTML = iframeWinStyle.innerHTML + css
    })
  }
}
