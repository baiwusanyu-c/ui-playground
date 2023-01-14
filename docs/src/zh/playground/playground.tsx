import { PlayGround, getPlayPreset } from 'ui-playground'
import '@ui-playground/theme/src/index.scss'
import '@ui-playground/theme/src/theme.scss'
// @ts-expect-error 加载demo模板
import demoPuMain from './demo-pure-main.vue?raw'
 const demoPu = () => {
    const playConfig = getPlayPreset('vue')
    playConfig.headerOption.useVersion = false
    playConfig.headerOption.logo = '../../public/logo.png'
    playConfig.headerOption.cdnSet = (
        link: string,
        pkgName: string,
        version: string,
        indexPath: string,
    ) => {
        return `${link}${pkgName}@${version}${indexPath}`
    }
    playConfig.mainFile.code = demoPuMain
    return playConfig
}
const playConfig = demoPu()
playConfig.isSSR = true
export const PlaygroundDemo = () => {
    return (
        <div style={{position: 'fixed', left: 0, top: '60px'}}>
            <PlayGround config={playConfig} />
        </div>
    )
}

