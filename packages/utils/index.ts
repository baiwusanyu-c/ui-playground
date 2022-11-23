import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'
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

export const extend = (objFir: any, objSec: any) => {
  return Object.assign({}, objFir, objSec)
}

export declare interface ISelectItem { value: string; label: string;key: string }
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
