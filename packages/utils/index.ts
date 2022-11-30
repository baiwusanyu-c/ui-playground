import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'
import type { fileStore } from '../store/file'
import type { IHooks, importItem } from './config'
// 防抖 没啥好说的
export function debounce(fn: Function, n = 100) {
  let handle: any
  return (...args: any[]) => {
    if (handle)
      clearTimeout(handle)
    handle = setTimeout(() => {
      fn(...args)
    }, n)
  }
}

// 转码，用于将 虚拟文件的代码等信息转化为 base46，并挂在 url 哈希上
export function utoa(data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

// 解码 用于将挂在 url 哈希上转化为虚拟文件信息、代码等。实现持久化
export function atou(base64: string): string {
  const binary = atob(base64)

  // zlib header (x78), level 9 (xDA)
  if (binary.startsWith('\x78\xDA')) {
    const buffer = strToU8(binary, true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
  }

  // old unicode hacks for backward compatibility
  // https://base64.guru/developers/javascript/examples/unicode-strings
  return decodeURIComponent(escape(binary))
}

export function deserialize(text: string): Record<string, any> {
  return text ? JSON.parse(atou(text)) : text
}

export function serialize(
  mainFile: string,
  importMap: Array<importItem>,
  files: Record<string, any>) {
  const state: Record<string, any> = {
    mainFile,
    importMap,
    files,
  }
  return utoa(JSON.stringify(state))
}

export const extend = (objFir: any, objSec: any) => {
  return Object.assign({}, objFir, objSec)
}

export declare interface ISelectItem { value: string, label: string, key: string }
export const createSelectList = (list: Array<string>, key: string) => {
  return list.map((val) => {
    return { value: val, label: val, key: val + key }
  })
}

export function setStorage(key: string, data: string) {
  if (!localStorage)
    return

  if (key != null && data != null)
    localStorage.setItem(key, data)
}

export function getStorage(key: string) {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : null
}

export const checkFileType = (filename: string) => /\.(vue|js|jsx|tsx|ts|css)$/.test(filename)

export const isEmptyObj = (item: unknown): boolean => JSON.stringify(item) === '{}'

export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'
export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export function isAsyncFunction(fn: Function) {
  const fnStr = fn.toString()
  return Object.prototype.toString.call(fn) === '[object AsyncFunction]' || fnStr.includes('return _regenerator.default.async(function')
}

export function createSandBox() {
  const sandbox = document.createElement('iframe')
  sandbox.setAttribute(
    'sandbox',
    [
      'allow-forms',
      'allow-modals',
      'allow-pointer-lock',
      'allow-popups',
      'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation-by-user-activation',
    ].join(' '),
  )
  sandbox.id = 'play_sandbox_frame'
  return sandbox
}

export function wrapperCustomCompiler(compileFunc: Function) {
  return isAsyncFunction(compileFunc)
    ? compileFunc
    : async(ctx: typeof fileStore, ...arg: any[]) => {
      return new Promise((resolve) => {
        resolve(compileFunc(ctx, ...arg))
      })
    }
}

export function runHooks(hooks: IHooks, name: string, ...arg: Array<any>) {
  const hookFunc = hooks[name as keyof typeof hooks]
  if (typeof hookFunc === 'function')
    hooks[name as keyof typeof hooks]!(...arg)
}
