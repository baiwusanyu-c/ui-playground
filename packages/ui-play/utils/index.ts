import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'
import evtBus from './event-bus'
import type { File, fileStore } from '../store/file'

import type { IHooks, importItem } from '../play.config'
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

// 转码，用于将虚拟文件的代码等信息转化为 base46，并挂在 url 哈希上
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
  files: Record<string, any>,
  isProdCompile: boolean,
  isSSRCompile: boolean) {
  const state: Record<string, any> = {
    mainFile,
    importMap,
    files,
    isProdCompile,
    isSSRCompile,
  }
  return utoa(JSON.stringify(state))
}

export const extend = <
  T extends Record<string, any>,
  U extends Record<string, any>>(
    objFir: T,
    objSec: U): T & U => {
  return Object.assign({}, objFir, objSec)
}

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

export function runHooks(
  hooks: IHooks,
  name: keyof typeof hooks,
  iframeElm: HTMLIFrameElement): void

export function runHooks(
  hooks: IHooks,
  name: keyof typeof hooks,
  evalFn: ((script: string | string[]) => Promise<unknown>) | null): void

export function runHooks(
  hooks: IHooks,
  name: keyof typeof hooks,
  fileST: typeof fileStore,
  isSSR: boolean): void

export function runHooks(
  hooks: IHooks,
  name: keyof typeof hooks,
  fileST: typeof fileStore,
  isSSR: boolean,
  modules: Array<string>): void

export function runHooks(
  hooks: IHooks,
  name: keyof typeof hooks,
  fileST: typeof fileStore,
  file: File,
  injectRes: Array<string> | string): void

export function runHooks(
  hooks: IHooks,
  name: keyof typeof hooks,
  fileST: typeof fileStore,
  file: File,
  compiler: Record<string, any>): void

export function runHooks(
  hooks: IHooks,
  name: keyof typeof hooks,
  ctx: ((script: string | string[]) => Promise<unknown>) | null | typeof fileStore | HTMLIFrameElement,
  isSSRAndFile?: File | boolean,
  modulesAndInject?: Array<string> | string | Record<string, any>,
) {
  const hookFunc = hooks[name as keyof typeof hooks] as (
    ctx: ((script: string | string[]) => Promise<unknown>) | null | typeof fileStore | HTMLIFrameElement,
    isSSRAndFile?: File | boolean,
    modulesAndInject?: Array<string> | string | Record<string, any>) => void
  if (typeof hookFunc === 'function')
    hookFunc(ctx, isSSRAndFile, modulesAndInject)
}

export function sendException(msg: string, type: 'error' | 'warning') {
  evtBus.emit('exceptionMessage', {
    show: true,
    msg,
    type,
  })
}

export const getUuid = (): string => {
  const s: Array<any> = []
  const hexDigits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < 36; i++)
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)

  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}
