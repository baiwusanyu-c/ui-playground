import type { LegacyRef } from 'react'

export declare type elType = LegacyRef<HTMLDivElement> | undefined

export declare type outputType = 'css' | 'ssr' | 'js'

export declare interface exceptionType {
  show: boolean
  msg: string
  type: 'warning' | 'error'
}
