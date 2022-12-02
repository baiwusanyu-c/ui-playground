import { presetVueConfig } from './preset-vue'
import {extend} from "../utils";
import {defaultConfig, presetTypes} from "../play.config";
export const usePlayPreset = (type: presetTypes) =>{
  if(type === 'vue'){
    const config = extend(defaultConfig, presetVueConfig)
    config.headerOption.libVersion = 'latest'
    config.headerOption.libMinVersion = '3.2.0'
    config.headerOption.libVersionLink = 'https://data.jsdelivr.com/v1/package/npm/vue'
    return config
  }

  // TODO react 预设
  if(type === 'react'){
    return extend(defaultConfig, presetVueConfig)
  }

  // TODO svelte 预设
  if(type === 'svelte'){
    return extend(defaultConfig, presetVueConfig)
  }
}