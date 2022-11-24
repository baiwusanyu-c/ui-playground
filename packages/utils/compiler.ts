import { transform } from 'sucrase'
import {File} from "../store/file";

export async function transformTS(src: string) {
  return transform(src, {
    transforms: ['typescript']
  }).code
}

export async function compileVue(file: File, compiler){
  debugger
}