import { extend } from '../utils'
import { defaultConfig } from '../play.config'
import { latestVersion, vueVersion, vueVersionLink } from '../utils/constant'
import { presetVueConfig } from './preset-vue'
import type { presetTypes } from '../play.config'

export function getPlayPreset(type: presetTypes) {
  if (type === 'vue') {
    const config = extend(defaultConfig, presetVueConfig)
    config.headerOption.libVersion = latestVersion
    config.headerOption.libMinVersion = vueVersion
    config.headerOption.libVersionLink = vueVersionLink
    return config
  }

  // TODO react 预设
  if (type === 'react')
    return extend(defaultConfig, presetVueConfig)

  // TODO svelte 预设
  if (type === 'svelte')
    return extend(defaultConfig, presetVueConfig)

  return defaultConfig
}
